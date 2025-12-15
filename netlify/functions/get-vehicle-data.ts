import { Handler } from "@netlify/functions";

const BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

export const handler: Handler = async (event) => {
  const { type, make } = event.queryStringParameters || {};

  try {
    let data: unknown[] = [];

    if (type === "makes") {
      // Fetch all makes (filtered for passenger cars to reduce noise)
      const response = await fetch(
        `${BASE_URL}/GetMakesForVehicleType/car?format=json`
      );
      const json = await response.json();
      const makesRaw = json.Results.map((item: any) => item.MakeName.trim());
      data = [...new Set(makesRaw)].sort(); // Deduplicate and sort
    } else if (type === "models" && make) {
      // Fetch models for specific make
      const response = await fetch(
        `${BASE_URL}/GetModelsForMake/${make}?format=json`
      );
      const json = await response.json();
      const modelsRaw = json.Results.map((item: any) => item.Model_Name.trim());
      data = [...new Set(modelsRaw)].sort();
    } else {
      return { statusCode: 400, body: "Invalid Parameters" };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: "API Error" }) };
  }
};
