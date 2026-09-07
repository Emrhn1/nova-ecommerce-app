import { prisma } from '@/lib/prisma';

export interface OrderDetailItem {
  id: string;
  productId: string;
  title: string;
  slug: string;
  imageUrl: string;
  category: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  } | null;
  items: OrderDetailItem[];
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export async function getOrderById(orderId: string, clerkUserId?: string): Promise<OrderDetail | null> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!order) return null;

    // Security check: if clerkUserId is provided, verify ownership
    if (clerkUserId && order.user.clerkId !== clerkUserId) {
      return null;
    }

    let parsedAddress = null;
    if (order.shippingAddress) {
      try {
        parsedAddress = JSON.parse(order.shippingAddress);
      } catch {
        parsedAddress = null;
      }
    }

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      shippingAddress: parsedAddress,
      user: {
        id: order.user.id,
        email: order.user.email,
        firstName: order.user.firstName,
        lastName: order.user.lastName,
      },
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        title: item.product.title,
        slug: item.product.slug,
        imageUrl: item.product.imageUrl,
        category: item.product.category.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };
  } catch (error) {
    console.error('Error in getOrderById:', error);
    return null;
  }
}
