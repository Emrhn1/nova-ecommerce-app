import { prisma } from '@/lib/prisma';
import { Category } from '@/types/product';

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || undefined,
      imageUrl: cat.imageUrl,
      itemCount: cat._count.products,
    }));
  } catch (error) {
    console.error('Error in getCategories query:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug: slug.toLowerCase() },
    });
  } catch (error) {
    console.error('Error in getCategoryBySlug query:', error);
    return null;
  }
}
