import { db } from "./db";
import { exchangeRates } from "./schema";
import { eq } from "drizzle-orm";

interface ExchangeRate {
  currency: string;
  rate: number;
  timestamp: string;
}

export async function getExchangeRates(baseCurrency: string = "USD"): Promise<ExchangeRate[]> {
  try {
    const cachedRates = await db
      .select()
      .from(exchangeRates)
      .where(eq(exchangeRates.baseCurrency, baseCurrency))
      .limit(1);

    const now = new Date();
    const cacheDuration = 60 * 60 * 1000;
    if (
      cachedRates.length > 0 &&
      cachedRates[0].updatedAt &&
      now.getTime() - new Date(cachedRates[0].updatedAt).getTime() < cacheDuration
    ) {
      return JSON.parse(cachedRates[0].rates);
    }

    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (!apiKey) {
      throw new Error("Exchange rate API key missing");
    }

    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`
    );
    const data = await response.json();
    if (data.result !== "success") {
      throw new Error("Failed to fetch exchange rates");
    }

    const rates: ExchangeRate[] = Object.entries(data.conversion_rates).map(([currency, rate]) => ({
      currency,
      rate: rate as number,
      timestamp: new Date(data.time_last_update_utc).toISOString(),
    }));

    await db
      .insert(exchangeRates)
      .values({
        baseCurrency,
        rates: JSON.stringify(rates),
        updatedAt: new Date(),
      })
      .onDuplicateKeyUpdate({
        set: {
          rates: JSON.stringify(rates),
          updatedAt: new Date(),
        },
      });

    return rates;
  } catch (error) {
    console.error("Exchange Rates Error:", error);
    throw new Error("Failed to fetch exchange rates");
  }
}

export async function convertAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) return amount;

  const rates = await getExchangeRates(fromCurrency);
  const rate = rates.find((r) => r.currency === toCurrency)?.rate;
  if (!rate) {
    throw new Error(`No exchange rate available for ${toCurrency}`);
  }

  return amount * rate;
}