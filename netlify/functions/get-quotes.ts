import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST")
    return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const data = JSON.parse(event.body || "{}");
    let baseRate = 100;

    // 1. Vehicle Risk (Luxury Tax)
    const luxuryBrands = [
      // German & European luxury
      "AUDI",
      "BMW",
      "MERCEDES-BENZ",
      "PORSCHE",
      "BENTLEY",
      "ROLLS-ROYCE",
      "MAYBACH",
      "LAMBORGHINI",
      "FERRARI",
      "MASERATI",
      "ASTON MARTIN",
      "MCLAREN",

      // Japanese luxury
      "LEXUS",
      "ACURA",
      "INFINITI",

      // American luxury
      "CADILLAC",
      "LINCOLN",

      // Electric / ultra-modern luxury
      "TESLA",
      "LUCID",
      "RIVIAN",
    ];

    if (luxuryBrands.includes(data.carMake?.toUpperCase())) baseRate += 60;

    // 2. Driver Age Risk
    if (data.driverAge < 25) baseRate *= 1.6;
    if (data.driverAge > 70) baseRate *= 1.2;

    // 3. Incident History Risk
    const incidents = data.incidents || [];
    let riskMultiplier = 1.0;

    if (incidents.includes("speeding_minor")) riskMultiplier += 0.2;
    if (incidents.includes("speeding_major")) riskMultiplier += 0.4;
    if (incidents.includes("accident_fault")) riskMultiplier += 0.6;
    if (incidents.includes("dui")) riskMultiplier += 1.2;
    if (incidents.includes("suspended")) riskMultiplier += 0.8;

    const finalRate = Math.round(baseRate * riskMultiplier);

    // 4. Generate Quotes
    const quotes = [
      {
        id: "1",
        provider: "SafeDrive",
        price: Math.round(finalRate * 0.9),
        coverage: "Liability Only",
        rating: 4.1,
      },
      {
        id: "2",
        provider: "AutoShield",
        price: Math.round(finalRate * 1.3),
        coverage: "Full Coverage",
        rating: 4.9,
      },
      {
        id: "3",
        provider: "QuickInsure",
        price: Math.round(finalRate * 1.1),
        coverage: "Standard",
        rating: 4.5,
      },
    ];

    // Filter out providers for high-risk drivers (DUI)
    const filteredQuotes = incidents.includes("dui")
      ? quotes.filter((q) => q.provider !== "SafeDrive")
      : quotes;

    await new Promise((resolve) => setTimeout(resolve, 800)); // Artificial delay

    return {
      statusCode: 200,
      body: JSON.stringify(filteredQuotes),
    };
  } catch (error) {
    return { statusCode: 500, body: "Internal Error" };
  }
};
