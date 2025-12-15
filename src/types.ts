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
  provider: string; // e.g. "Geico"
  logo: string; // URL to logo image
  price: number;
  coverageType: string; // e.g. "Premium", "Standard"
  limits: string; // e.g. "100/300/100"
  rating: number;
  perks: string[];
}
