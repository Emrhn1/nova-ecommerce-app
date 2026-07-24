export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl: string;
  itemCount: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  badge?: 'New' | 'Sale' | 'Best Seller';
  inStock: boolean;
}
