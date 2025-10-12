# Sistema de Gestão FEMAR

Uma solução de gestão integrada (ERP) para a Fundação de Estudos do Mar (FEMAR), projetada para administrar projetos, faturamento, finanças e pessoal, enriquecida com um assistente de IA para fornecer insights inteligentes e automação.

## Módulos Principais

O sistema é dividido em módulos para cobrir todas as áreas de gestão da fundação:

-   **Dashboard:** Visão geral da saúde da fundação com KPIs, gráficos de desempenho e acesso rápido a insights gerados por IA.
-   **Minhas Aprovações:** Uma central para gestores visualizarem e atuarem sobre todas as pendências que necessitam de sua aprovação (requisições, viagens, etc.).
-   **Financeiro:** Controle completo de contas a pagar e receber.
-   **Projetos:** Gestão de projetos com kanban, cronograma, entregas e análise de risco por IA.
-   **Contratos:** Cadastro e gestão do ciclo de vida dos contratos.
-   **Cadastros:** Central para gerenciar clientes, fornecedores, produtos, serviços, plano de contas, etc.
-   **Recursos Humanos:** Módulo completo para gestão de pessoal, incluindo equipe, apontamento de horas, diárias e viagens, avaliações de desempenho, férias, onboarding e organograma.
-   **Compras:** Fluxo de ponta a ponta, desde a solicitação, mapa de cotações com IA, geração de ordem de compra, e recebimento integrado ao estoque e financeiro.
-   **Almoxarifado:** Controle de estoque e gestão de requisições de materiais.
-   **Documentos:** Repositório central para documentos com versionamento, permissões e busca inteligente por IA.
-   **Logística:** Controle de lotes de amostras e remessas.
-   **Patrimônio:** Gestão de ativos e cálculo de depreciação.
-   **Contabilidade:** Lotes contábeis, integração bancária e conciliação auxiliada por IA.
-   **Orçamento:** Planejamento e acompanhamento orçamentário por rubricas.
-   **Convênios:** Gestão de propostas, convênios e um novo módulo de compliance para acompanhar obrigações contratuais com auxílio de IA.
-   **Relatórios:** Central com relatórios gerenciais (Fluxo de Caixa, DRE) e um construtor para relatórios personalizados.
-   **Configurações:** Parametrização do sistema, gestão de usuários, trilha de auditoria e um novo motor de workflows de aprovação.
-   **Portal de Transparência:** Uma visão dedicada para financiadores, com dashboards de acompanhamento de projetos e relatórios de prestação de contas.

## Funcionalidades com Inteligência Artificial (Gemini)

-   **Análise de Despesas por Imagem:** Envie a foto de uma nota fiscal e a IA extrai os dados para criar uma conta a pagar.
-   **Assistente de Análise (Dashboard e Projetos):** Gera resumos executivos, identifica riscos e sugere ações com base nos dados apresentados.
-   **Busca por Linguagem Natural:** Comande o sistema ou faça perguntas através de uma interface de chat.
-   **Análise Comparativa de Projetos:** Compare múltiplos projetos e peça insights específicos.
-   **Consulta Inteligente de Documentos:** "Pergunte" ao conteúdo de um documento e obtenha respostas diretas.
-   **Sugestão de Contas Contábeis:** A IA sugere a classificação contábil correta para despesas.
-   **Geração de Guia de Boas-Vindas:** Cria um texto personalizado para o onboarding de novos colaboradores.
-   **Resumo Narrativo para Financiadores:** Gera um relatório de progresso textual para o Portal de Transparência.
-   **Análise de Fluxo de Caixa Preditivo:** Prevê gargalos de caixa e sugere ações.
-   **Extração de Dados de Cotações:** A IA lê o texto de uma proposta e preenche o mapa comparativo.
-   **Análise de Editais de Convênio:** Cole o texto de um edital e a IA sugere as principais obrigações e prazos a serem cumpridos.

## Perfis de Usuário

O sistema possui um controle de acesso baseado em perfis para garantir a segurança e a pertinência das informações para cada usuário.

-   **Admin:** Acesso total a todas as funcionalidades, incluindo configurações do sistema e gestão de usuários.
-   **Superintendente:** Perfil de alta gestão com ampla visibilidade sobre dashboards, relatórios e módulos de projetos e finanças, focado em análise estratégica.
-   **Financeiro:** Acesso aos módulos de Finanças, Contabilidade, Faturamento, Cadastros e Compras.
-   **Gerente de Projetos / Coordenador:** Acesso total aos módulos de Projetos, Contratos, Convênios e gestão de suas equipes no RH.
-   **Fiscal:** Acesso focado em auditoria, com permissão para visualizar Projetos, Contratos, relatórios financeiros e de prestação de contas.
-   **Colaborador:** Perfil básico para membros da equipe, com acesso ao módulo de Recursos Humanos para apontamento de horas e solicitações, e ao almoxarifado para requisição de materiais.
-   **Funder (Financiador):** Perfil externo com acesso exclusivo ao Portal de Transparência para acompanhar o andamento dos projetos que financia.

## Tecnologias

-   **Frontend:** React com TypeScript e Tailwind CSS.
-   **Inteligência Artificial:** API do Google Gemini.
-   **Armazenamento (Prototipagem):** `localStorage` para simular um banco de dados e permitir o funcionamento offline.

---
*Documentação atualizada em: 2024-07-25*
