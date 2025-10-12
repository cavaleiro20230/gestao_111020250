// FIX: Create this file to centralize all Gemini API calls.
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import type { 
    FinancialData, AIExpenseData, ProjectAnalysisData, ExecutiveSummaryData,
    Project, Personnel, ComplianceObligation, ChartOfAccount, AppContextType
} from '../types';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

export async function getFinancialInsights(data: FinancialData): Promise<string> {
  const model = 'gemini-2.5-flash';
  const prompt = `
    Analyze the following financial data for a foundation and provide strategic insights.
    Data: ${JSON.stringify(data)}
    
    Focus on:
    - Key trends in monthly performance (revenue vs. expenses).
    - The significance of the top expense categories.
    - Provide 2-3 actionable recommendations based on the data.
    - Format the output as a concise summary in Brazilian Portuguese.
  `;

  const response = await ai.models.generateContent({
      model,
      contents: prompt,
  });

  return response.text;
}

export async function getExecutiveSummary(data: ExecutiveSummaryData): Promise<string> {
  const model = 'gemini-2.5-flash';
  const prompt = `
    Você é um consultor financeiro para a diretoria de uma fundação de pesquisa.
    Analise os seguintes dados consolidados e gere um resumo executivo em 3 parágrafos.
    
    Dados: ${JSON.stringify(data, null, 2)}

    Seu resumo deve abordar:
    1.  **Saúde Financeira Geral:** Comente sobre a relação receita vs. despesa.
    2.  **Riscos e Oportunidades:** Destaque os projetos em risco e comente sobre a distribuição de recursos.
    3.  **Recomendações Estratégicas:** Forneça uma recomendação clara para a diretoria.
    
    Seja direto, profissional e use o formato de parágrafos. A resposta deve ser em português do Brasil.
  `;
  const response = await ai.models.generateContent({ model, contents: prompt });
  return response.text;
}

export async function getProjectAnalysis(data: ProjectAnalysisData): Promise<string> {
    const model = 'gemini-2.5-flash';
    const prompt = `
        Analyze the following project data and provide a strategic analysis for the project manager.
        Data: ${JSON.stringify(data, null, 2)}

        Your analysis should cover:
        - **Financial Health:** Is the project on, over, or under budget? What is the burn rate?
        - **Risk Assessment:** Based on spending and timeline, identify potential risks (e.g., running out of budget before the deadline).
        - **Key Spending Areas:** Highlight the most significant expense categories.
        - **Actionable Recommendations:** Suggest 1-2 concrete actions the project manager can take.
        
        The response should be in Brazilian Portuguese, formatted as a clear, concise report. Use bullet points for recommendations.
    `;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
}


export async function analyzeExpenseDocument(base64Image: string, mimeType: string): Promise<AIExpenseData> {
  const model = 'gemini-2.5-flash';
  const prompt = `
    Extract the following information from the expense document (invoice or receipt):
    - A brief description of the main service or product provider.
    - The total value of the expense.
    - The due date (or issue date if due date is not present).
    - A suggested category for this expense (e.g., 'Alimentação', 'Transporte', 'Material de Escritório', 'Serviços').
    
    The response must be in JSON format.
  `;

  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64Image,
    },
  };

  const textPart = {
    text: prompt
  };

  const response = await ai.models.generateContent({
    model: model,
    contents: { parts: [imagePart, textPart] },
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                description: { type: Type.STRING },
                category: { type: Type.STRING },
                value: { type: Type.NUMBER },
                dueDate: { type: Type.STRING, description: "Format as YYYY-MM-DD" },
            }
        }
    }
  });

  try {
      const json = JSON.parse(response.text);
      return json as AIExpenseData;
  } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", response.text);
      throw new Error("Could not understand the document. Please try a clearer image.");
  }
}

export async function processNaturalLanguageCommand(context: AppContextType, command: string) {
    const navigateToPage: FunctionDeclaration = {
        name: 'navigateToPage',
        parameters: {
            type: Type.OBJECT,
            properties: {
                pageName: { type: Type.STRING, description: 'The name of the page to navigate to from the Page enum' },
            },
            required: ['pageName']
        },
        description: 'Navigates the user to a specific page in the application.'
    };
    
    const createTask: FunctionDeclaration = {
        name: 'createTask',
        parameters: {
            type: Type.OBJECT,
            properties: {
                projectName: { type: Type.STRING, description: 'The name of the project for the task' },
                title: { type: Type.STRING, description: 'The title of the task' },
                dueDate: { type: Type.STRING, description: 'The due date for the task in YYYY-MM-DD format' }
            },
            required: ['projectName', 'title']
        },
        description: 'Creates a new task for a specific project.'
    };
    
    const findProject: FunctionDeclaration = {
        name: 'findProject',
        parameters: {
            type: Type.OBJECT,
            properties: {
                projectName: { type: Type.STRING, description: 'The name of the project to find' }
            },
            required: ['projectName']
        },
        description: 'Finds a project and returns its details.'
    };

    const model = 'gemini-2.5-flash';
    const contents = `
        User Command: "${command}"
        
        Available Projects: ${context.projects.map(p => p.name).join(', ')}
        Available Pages: ${Object.keys(context.pageMappings).join(', ')}

        Analyze the user command. If it's a direct action, call the appropriate function. If it's a question, answer it based on the provided context.
    `;

    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            tools: [{ functionDeclarations: [navigateToPage, createTask, findProject] }]
        }
    });

    return { text: response.text, functionCalls: response.functionCalls };
}

export async function suggestChartOfAccount(category: string, accounts: ChartOfAccount[]): Promise<string> {
    const model = 'gemini-2.5-flash';
    const prompt = `
        Given the expense category "${category}", which of the following accounting chart of accounts is the most appropriate debit account?
        
        Available accounts:
        ${accounts.map(a => `${a.id}: ${a.code} - ${a.name}`).join('\n')}

        Respond with ONLY the ID of the most appropriate account.
    `;
    const response = await ai.models.generateContent({ model, contents: prompt });
    const suggestedId = response.text.trim();
    if (!accounts.some(a => a.id === suggestedId)) {
        throw new Error("IA suggestion was not a valid account ID.");
    }
    return suggestedId;
}

export async function getComparativeProjectAnalysis(projectsData: ProjectAnalysisData[], question: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    const prompt = `
        You are a project analysis expert for a foundation.
        Analyze the data for the following projects:
        ${JSON.stringify(projectsData, null, 2)}
        
        Now, answer the following question based on a comparison of the data:
        Question: "${question}"

        Provide a clear, direct answer in Brazilian Portuguese. If the data allows, use comparisons and numbers to support your conclusion.
    `;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
}

export async function queryDocumentContent(content: string, question: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    const prompt = `
        Based on the following document content, answer the user's question.
        
        Document Content:
        ---
        ${content}
        ---
        
        Question: "${question}"

        Answer concisely and directly in Brazilian Portuguese.
    `;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
}

export async function suggestComplianceObligations(documentText: string): Promise<Partial<ComplianceObligation>[]> {
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
        model,
        contents: `Analyze the following grant or contract text and extract key compliance obligations and their due dates. Focus on deliverables, reports, and deadlines. Text: "${documentText}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING },
                        dueDate: { type: Type.STRING, description: "Format as YYYY-MM-DD" },
                    }
                }
            }
        }
    });

    try {
        const json = JSON.parse(response.text);
        return json as Partial<ComplianceObligation>[];
    } catch (e) {
        throw new Error("Could not parse AI suggestions.");
    }
}

export async function generateWelcomeGuide(employee: Personnel): Promise<string> {
    const model = 'gemini-2.5-flash';
    const prompt = `
        Generate a friendly and helpful welcome guide for a new employee joining a research foundation.
        
        Employee Details:
        - Name: ${employee.name}
        - Position: ${employee.position}
        
        The guide should include:
        - A warm welcome message.
        - A brief, inspiring overview of the foundation's mission (assume it's related to scientific and technological research for societal benefit).
        - A "First Day Checklist" with items like "Meet your manager", "Get your equipment", "Complete HR paperwork".
        - A list of "Key Contacts" (e.g., HR, IT Support, Manager - use placeholders for names).
        - A concluding encouraging remark.
        
        Write it in Brazilian Portuguese.
    `;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
}
