import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  {
    name: 'Audio',
    slug: 'audio',
    description: 'Noise-canceling headphones & studio monitors',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Workspace',
    slug: 'workspace',
    description: 'Ergonomic desks, lamps & mechanical keyboards',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Carry',
    slug: 'carry',
    description: 'Minimalist backpacks, sleeves & travel organizers',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Wearables',
    slug: 'wearables',
    description: 'Smart watches, straps & everyday accessories',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
  },
];

const PRODUCTS = [
  {
    title: 'NOVA Wireless Studio Headphones',
    slug: 'nova-wireless-studio-headphones',
    categorySlug: 'audio',
    price: 299,
    originalPrice: 349,
    rating: 4.9,
    reviewCount: 128,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    badge: 'Best Seller',
    inStock: true,
    description: 'High-fidelity wireless studio headphones with active noise cancellation, 40-hour battery life, and ultra-soft memory foam earcups.',
  },
  {
    title: 'Minimalist Aluminum Desk Lamp',
    slug: 'minimalist-aluminum-desk-lamp',
    categorySlug: 'workspace',
    price: 149,
    rating: 4.7,
    reviewCount: 84,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    badge: 'New',
    inStock: true,
    description: 'Precision-engineered aircraft-grade aluminum LED desk lamp featuring touch-dimming, color temperature adjustment, and integrated USB-C charging.',
  },
  {
    title: 'Waterproof Everyday Backpack 20L',
    slug: 'waterproof-everyday-backpack-20l',
    categorySlug: 'carry',
    price: 189,
    originalPrice: 220,
    rating: 4.8,
    reviewCount: 96,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    badge: 'Sale',
    inStock: true,
    description: 'Weatherproof 20L daypack crafted from recycled Cordura nylon with padded 16-inch laptop sleeve and hidden passport security pocket.',
  },
  {
    title: 'Tactile Wireless Mechanical Keyboard',
    slug: 'tactile-wireless-mechanical-keyboard',
    categorySlug: 'workspace',
    price: 169,
    rating: 4.9,
    reviewCount: 210,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    badge: 'Best Seller',
    inStock: true,
    description: 'Low-profile wireless mechanical keyboard with hot-swappable tactile switches, per-key RGB lighting, and multi-device Bluetooth pairing.',
  },
];

async function main() {
  console.log('🌱 Starting Database Seeding...');

  // 1. Seed Categories
  const categoryMap = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, createdCategory.id);
    console.log(`✓ Category seeded: ${createdCategory.name}`);
  }

  // 2. Seed Products
  for (const prod of PRODUCTS) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) continue;

    const { categorySlug, ...productData } = prod;

    const createdProduct = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        ...productData,
        categoryId,
      },
      create: {
        ...productData,
        categoryId,
      },
    });
    console.log(`✓ Product seeded: ${createdProduct.title}`);
  }

  console.log('✅ Database Seeding Completed Successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
