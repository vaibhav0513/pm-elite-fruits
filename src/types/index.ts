export type Localized = { en: string; mr: string; hi: string };

export type Category = 'berries' | 'tropical';

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
};