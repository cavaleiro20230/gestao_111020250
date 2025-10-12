// A simple service to fetch exchange rates from a public API

interface ExchangeRateResponse {
    result: string;
    base_code: string;
    rates: { [key: string]: number };
}

/**
 * Fetches the latest exchange rates from a public API.
 * @param baseCurrency The base currency to fetch rates against. Defaults to 'BRL'.
 * @returns A promise that resolves to an object containing currency rates.
 */
export async function getExchangeRates(baseCurrency: string = 'BRL'): Promise<{ rates: { [key: string]: number } }> {
    try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
        }
        const data: ExchangeRateResponse = await response.json();
        if (data.result !== 'success') {
            throw new Error('API did not return a successful response.');
        }
        return { rates: data.rates };
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        // In a real app, you might want to have a fallback mechanism or more robust error handling
        throw new Error("Could not retrieve currency exchange rates.");
    }
}