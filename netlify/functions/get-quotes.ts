import { Handler } from "@netlify/functions";

// Real Provider Data
const PROVIDERS = [
  {
    name: "Geico",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Geico_logo.svg",
    url: "https://www.geico.com",
    baseFactor: 0.85,
    minAge: 16,
    toleratesIncidents: true,
  },
  {
    name: "State Farm",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/State_Farm_logo.svg",
    url: "https://www.statefarm.com",
    baseFactor: 1.0,
    minAge: 18,
    toleratesIncidents: false,
  },
  {
    name: "Progressive",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Logo_of_the_Progressive_Corporation.svg",
    url: "https://www.progressive.com",
    baseFactor: 0.95,
    minAge: 16,
    toleratesIncidents: true,
  },
  {
    name: "Allstate",
    logo: "https://upload.wikimedia.org/wikipedia/en/3/30/Allstate_logo.svg",
    url: "https://www.allstate.com",
    baseFactor: 1.1,
    minAge: 18,
    toleratesIncidents: true,
  },
  {
    name: "Liberty Mutual",
    logo: "https://upload.wikimedia.org/wikipedia/en/5/5a/Liberty_Mutual_Insurance_logo.svg",
    url: "https://www.libertymutual.com",
    baseFactor: 1.05,
    minAge: 21,
    toleratesIncidents: false,
  },
];

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST")
    return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const data = JSON.parse(event.body || "{}");

    // --- 1. RISK CALCULATION ---
    let riskScore = 1.0;

    if (data.driverAge < 25) riskScore += 0.5;
    if (data.driverAge > 70) riskScore += 0.2;

    const luxuryBrands = [
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
      "LEXUS",
      "ACURA",
      "INFINITI",
      "CADILLAC",
      "LINCOLN",
      "TESLA",
      "LUCID",
      "RIVIAN",
    ];
    if (luxuryBrands.includes(data.carMake?.toUpperCase())) riskScore += 0.4;

    const incidents = data.incidents || [];
    if (incidents.includes("speeding_major")) riskScore += 0.3;
    if (incidents.includes("accident_fault")) riskScore += 0.5;
    if (incidents.includes("dui")) riskScore += 1.5;

    // --- 2. GENERATE QUOTES ---
    const basePrice = 120;
    const quotes = PROVIDERS.filter((p) => {
      if (incidents.includes("dui") && !p.toleratesIncidents) return false;
      if (data.driverAge < p.minAge) return false;
      return true;
    })
      .map((p, index) => {
        const variance = 0.9 + Math.random() * 0.2;
        const finalPrice = Math.round(
          basePrice * riskScore * p.baseFactor * variance
        );

        return {
          id: `quote-${index}`,
          provider: p.name,
          logo: p.logo,
          url: p.url, // Pass the URL here
          price: finalPrice,
          rating: 4.0 + Number(Math.random().toFixed(1)),
          coverageType:
            finalPrice > 250 ? "Premium Coverage" : "Standard Coverage",
          limits: finalPrice > 250 ? "100/300/100" : "50/100/50",
          perks: [
            "24/7 Support",
            finalPrice > 200 ? "Accident Forgiveness" : "Paperless Discount",
            "Mobile App",
          ],
        };
      })
      .sort((a, b) => a.price - b.price);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    return {
      statusCode: 200,
      body: JSON.stringify(quotes),
    };
  } catch (error) {
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
