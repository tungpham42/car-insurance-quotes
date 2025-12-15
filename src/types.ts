export interface FormData {
  carYear?: number;
  carMake?: string;
  carModel?: string;
  driverAge?: number;
  gender?: "male" | "female";
  incidents?: string[];
}

export interface Quote {
  id: string;
  provider: string;
  logo: string;
  url: string; // New field for the website link
  price: number;
  coverageType: string;
  limits: string;
  rating: number;
  perks: string[];
}
