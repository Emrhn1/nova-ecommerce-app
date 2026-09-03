import { prisma } from '@/lib/prisma';
import { Product } from '@/types/product';

export interface GetProductsOptions {
  category?: string;
  sort?: string;
  sale?: boolean;
  search?: string;
}

export async function getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
  const { category, sort = 'newest', sale = false, search } = options;

  const where: any = {};

  if (category) {
    where.category = {
      slug: category.toLowerCase(),
    };
  }

  if (sale) {
    where.badge = 'Sale';
  }

  if (search) {
    const term = search.trim();
    where.OR = [
      { title: { contains: term, mode: 'insensitive' } },
      { description: { contains: term, mode: 'insensitive' } },
      { category: { name: { contains: term, mode: 'insensitive' } } },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-asc') {
    orderBy = { price: 'asc' };
  } else if (sort === 'price-desc') {
    orderBy = { price: 'desc' };
  } else if (sort === 'rating') {
    orderBy = { rating: 'desc' };
  }

  try {
    const dbProducts = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
      },
    });

    return dbProducts.map((prod: any) => ({
      id: prod.id,
      title: prod.title,
      slug: prod.slug,
      category: prod.category.name,
      price: prod.price,
      originalPrice: prod.originalPrice || undefined,
      rating: prod.rating,
      reviewCount: prod.reviewCount,
      imageUrl: prod.imageUrl,
      badge: (prod.badge as any) || undefined,
      inStock: prod.inStock,
    }));
  } catch (error) {
    console.error('Error in getProducts query:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const prod = await prisma.product.findUnique({
      where: { slug: slug.toLowerCase() },
      include: {
        category: true,
        images: true,
        reviews: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!prod) return null;

    return {
      ...prod,
      categoryName: prod.category.name,
      categorySlug: prod.category.slug,
    };
  } catch (error) {
    console.error('Error in getProductBySlug query:', error);
    return null;
  }
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      take: limit,
      orderBy: { rating: 'desc' },
      include: { category: true },
    });

    return dbProducts.map((prod: any) => ({
      id: prod.id,
      title: prod.title,
      slug: prod.slug,
      category: prod.category.name,
      price: prod.price,
      originalPrice: prod.originalPrice || undefined,
      rating: prod.rating,
      reviewCount: prod.reviewCount,
      imageUrl: prod.imageUrl,
      badge: (prod.badge as any) || undefined,
      inStock: prod.inStock,
    }));
  } catch (error) {
    console.error('Error in getFeaturedProducts query:', error);
    return [];
  }
}
