import { z } from 'zod';

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().min(3, 'Valid postal/ZIP code is required'),
  country: z.string().min(2, 'Country is required').default('Turkey'),
  saveAddress: z.boolean().optional().default(false),
});

export const shippingMethodSchema = z.object({
  method: z.enum(['standard', 'express'], {
    message: 'Please select a shipping method',
  }),
});

export const paymentSchema = z.object({
  cardHolder: z.string().min(2, 'Cardholder name is required'),
  cardNumber: z
    .string()
    .transform((val) => val.replace(/\s+/g, ''))
    .refine((val) => /^\d{16}$/.test(val), {
      message: 'Card number must be 16 digits',
    }),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Expiry date must be in MM/YY format'),
  cvc: z.string().regex(/^\d{3,4}$/, 'CVC must be 3 or 4 digits'),
});

export const checkoutFormSchema = shippingAddressSchema
  .merge(shippingMethodSchema)
  .merge(paymentSchema);

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type ShippingMethodInput = z.infer<typeof shippingMethodSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;

export const orderItemInputSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  unitPrice: z.number().positive('Unit price must be positive'),
});

export const createOrderInputSchema = z.object({
  shippingAddress: shippingAddressSchema,
  shippingMethod: z.enum(['standard', 'express']),
  items: z.array(orderItemInputSchema).min(1, 'Order must have at least 1 item'),
  promoCode: z.string().optional(),
  discountAmount: z.number().nonnegative().optional().default(0),
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;
