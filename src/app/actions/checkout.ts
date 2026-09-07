'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { createOrderInputSchema, CreateOrderInput } from '@/lib/validations/checkout';

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
}

export async function createOrderAction(input: CreateOrderInput): Promise<CreateOrderResult> {
  try {
    // 1. Authenticate user via Clerk
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return {
        success: false,
        error: 'You must be signed in to complete your purchase.',
      };
    }

    const clerkUser = await currentUser();
    const primaryEmail =
      clerkUser?.emailAddresses?.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress ||
      clerkUser?.emailAddresses?.[0]?.emailAddress ||
      input.shippingAddress.email;

    const firstName = clerkUser?.firstName || input.shippingAddress.fullName.split(' ')[0] || null;
    const lastName =
      clerkUser?.lastName ||
      input.shippingAddress.fullName.split(' ').slice(1).join(' ') ||
      null;

    // 2. Validate input schema
    const parsed = createOrderInputSchema.safeParse(input);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Invalid order data provided.';
      return {
        success: false,
        error: firstError,
      };
    }

    const validatedData = parsed.data;

    // 3. Upsert User in Prisma DB
    const user = await prisma.user.upsert({
      where: { email: primaryEmail },
      update: {
        clerkId,
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
      },
      create: {
        clerkId,
        email: primaryEmail,
        firstName,
        lastName,
        role: 'CUSTOMER',
      },
    });

    // 4. Atomic Transaction: Verify Stock, Decrement Stock, Create Order & Items
    const result = await prisma.$transaction(async (tx) => {
      const productIds = validatedData.items.map((i) => i.productId);
      const dbProducts = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      const productMap = new Map(dbProducts.map((p) => [p.id, p]));

      // Verify each product exists and has stock
      let subtotal = 0;
      for (const item of validatedData.items) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new Error(
            `Insufficient stock for "${product.title}". Only ${product.stockQuantity} available.`
          );
        }

        subtotal += product.price * item.quantity;
      }

      // Calculate totals
      const shippingCost =
        validatedData.shippingMethod === 'express'
          ? 15
          : subtotal >= 150
            ? 0
            : 15;
      const taxCost = subtotal * 0.08;
      const discount = Math.min(subtotal, validatedData.discountAmount || 0);
      const totalAmount = Math.max(0, subtotal - discount + shippingCost + taxCost);

      // Generate unique order number (e.g., NOVA-849201)
      const orderNumber = `NOVA-${Math.floor(100000 + Math.random() * 900000)}`;

      // Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          totalAmount: Math.round(totalAmount * 100) / 100,
          status: 'PROCESSING',
          shippingAddress: JSON.stringify(validatedData.shippingAddress),
          items: {
            create: validatedData.items.map((item) => {
              const product = productMap.get(item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: product.price,
              };
            }),
          },
        },
      });

      // Decrement stock for all items
      for (const item of validatedData.items) {
        const product = productMap.get(item.productId)!;
        const newStock = product.stockQuantity - item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: newStock,
            inStock: newStock > 0,
          },
        });
      }

      // If user opted to save address, persist in Address table
      if (validatedData.shippingAddress.saveAddress) {
        await tx.address.create({
          data: {
            userId: user.id,
            title: 'Shipping Address',
            fullName: validatedData.shippingAddress.fullName,
            street: validatedData.shippingAddress.street,
            city: validatedData.shippingAddress.city,
            state: validatedData.shippingAddress.state || null,
            postalCode: validatedData.shippingAddress.postalCode,
            country: validatedData.shippingAddress.country,
            isDefault: true,
          },
        });
      }

      return order;
    });

    return {
      success: true,
      orderId: result.id,
      orderNumber: result.orderNumber,
    };
  } catch (error: any) {
    console.error('Error in createOrderAction:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred while placing your order.',
    };
  }
}
