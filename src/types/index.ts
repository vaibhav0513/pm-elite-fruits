export type FruitStatus = "available" | "upcoming" | "out";
export type Localized = { en: string; mr: string; hi: string };

export type Category = "berries" | "tropical";

export type Fruit = {
  slug: string;
  name: Localized;
  description: Localized;
  category: Category;
  pricePerKg: number; // rupees
  inStock: boolean;
  emoji: string; // placeholder until real photos are added
  images?: string[]; // photos, first one is the cover
  tint: string; // tailwind class for the card background
  featured: boolean;
  status?: FruitStatus;
  updatedAt?: string;
  options?: PriceOption[];
  hidePrice?: boolean;
};

export type PriceOption = {
  id: string;
  mode: "weight" | "count"; // weight = price per kg, count = fixed pack / box / dozen
  label: string; // pack name, only used when mode is 'count'
  price: number;
};
