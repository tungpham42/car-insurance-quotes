export interface FormData {
  // Vehicle Data
  carYear?: number;
  carMake?: string;
  carModel?: string;

  // Driver Data
  driverAge?: number;
  gender?: "male" | "female";
  incidents?: string[]; // Array of keys like 'speeding', 'dui'
}

export interface Quote {
  id: string;
  provider: string;
  price: number;
  coverage: string;
  rating: number;
}
