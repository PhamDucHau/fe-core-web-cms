export interface LandingCategory {
  _id: string;
  name: string;
}

export interface LandingProduct {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  thumbnailUrl?: string;
  categoryName?: string;
}

export const FEATURED_CATEGORIES: LandingCategory[] = [
  { _id: "1", name: "Engine Parts" },
  { _id: "2", name: "Braking Systems" },
  { _id: "3", name: "Accessories" },
  { _id: "4", name: "Premium Sets" },
];

export const FEATURED_PRODUCTS: LandingProduct[] = [
  { _id: "1", name: "Car Wheel With Rotor", price: 25, salePrice: 18, categoryName: "Parts" },
  { _id: "2", name: "Child Car Seat", price: 50, categoryName: "Accessories" },
  { _id: "3", name: "Car Seat", price: 45, categoryName: "Accessories" },
  { _id: "4", name: "Tire Pressure Gauge", price: 40, salePrice: 35, categoryName: "Accessories" },
  { _id: "5", name: "Disc Brake", price: 250, salePrice: 200, categoryName: "Premium Sets" },
  { _id: "6", name: "BMW Boosted Engine", price: 150, salePrice: 117, categoryName: "Accessories" },
];
