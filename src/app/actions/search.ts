'use server';

import { getProducts } from '@/lib/db/products';
import { Product } from '@/types/product';

export async function searchProductsAction(query: string): Promise<Product[]> {
  const term = query?.trim();
  if (!term) return [];
  return await getProducts({ search: term });
}
