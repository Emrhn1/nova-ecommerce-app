import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Calendar,
  ArrowRight,
  ShoppingBag,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { getOrderById } from '@/lib/db/orders';
import ClearCartOnSuccess from '@/components/checkout/ClearCartOnSuccess';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmed | Nova Store',
  robots: {
    index: false,
    follow: false,
  },
};

interface OrderSuccessPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderId } = await params;
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect('/login');
  }

  const order = await getOrderById(orderId, clerkId);

  if (!order) {
    notFound();
  }

  // Estimated delivery calculation (3 business days ahead)
  const orderDate = new Date(order.createdAt);
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <ClearCartOnSuccess />

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        {/* Success Banner */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: 'success.light',
              color: 'success.dark',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
            }}
          >
            <CheckCircle size={40} />
          </Box>
          <Typography variant="overline" sx={{ color: 'success.main', fontWeight: 800, letterSpacing: 1.5 }}>
            PAYMENT SUCCESSFUL
          </Typography>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mt: 0.5, mb: 1 }}>
            Thank You For Your Order!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 540, mx: 'auto' }}>
            We received your order and are preparing it for shipment. A confirmation email with your invoice has been sent to{' '}
            <strong>{order.user.email}</strong>.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Chip
              label={`Order ID: ${order.orderNumber}`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 700, px: 1, py: 2, fontSize: '0.9rem' }}
            />
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column: Order Items & Delivery Info */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              {/* Items Card */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                    <Package size={20} className="text-primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Ordered Items ({order.items.length})
                    </Typography>
                  </Box>

                  <Stack spacing={2.5} divider={<Divider />}>
                    {order.items.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Box
                          component="img"
                          src={item.imageUrl}
                          alt={item.title}
                          sx={{
                            width: 70,
                            height: 70,
                            borderRadius: 1,
                            objectFit: 'cover',
                            bgcolor: 'action.hover',
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        />
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {item.category}
                          </Typography>
                          <Link
                            href={`/products/${item.category.toLowerCase()}/${item.slug}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                                display: 'block',
                                '&:hover': { color: 'primary.main' },
                              }}
                            >
                              {item.title}
                            </Typography>
                          </Link>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Quantity: {item.quantity}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            ${item.unitPrice.toFixed(2)} each
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Delivery & Shipping Info */}
              <Grid container spacing={3}>
                {/* Shipping Address */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card
                    elevation={0}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <MapPin size={18} className="text-primary" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Shipping Address
                        </Typography>
                      </Box>
                      {order.shippingAddress ? (
                        <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {order.shippingAddress.fullName}
                          </Typography>
                          <Typography variant="body2">{order.shippingAddress.street}</Typography>
                          <Typography variant="body2">
                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                          </Typography>
                          <Typography variant="body2">{order.shippingAddress.country}</Typography>
                          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                            Phone: {order.shippingAddress.phone}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Standard Customer Address
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Estimated Delivery */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card
                    elevation={0}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Truck size={18} className="text-primary" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Estimated Delivery
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
                        {formattedDelivery}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Carrier: Express Tracked Shipping
                      </Typography>
                      <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Clock size={15} color="var(--mui-palette-text-secondary)" />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Tracking details will be emailed upon dispatch
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Stack>
          </Grid>

          {/* Right Column: Payment Summary & Next Steps */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                    Payment Summary
                  </Typography>

                  <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Payment Status
                      </Typography>
                      <Chip label={order.status} size="small" color="success" sx={{ fontWeight: 700 }} />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Payment Method
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Credit / Debit Card
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Order Date
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      Total Paid
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      ${order.totalAmount.toFixed(2)}
                    </Typography>
                  </Box>

                  <Stack spacing={1.5}>
                    <Link href="/products" style={{ textDecoration: 'none', width: '100%', display: 'block' }}>
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        endIcon={<ArrowRight size={18} />}
                        sx={{ py: 1.25, fontWeight: 700 }}
                      >
                        Continue Shopping
                      </Button>
                    </Link>
                    <Link href="/" style={{ textDecoration: 'none', width: '100%', display: 'block' }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ py: 1.25, fontWeight: 600 }}
                      >
                        Back to Home
                      </Button>
                    </Link>
                  </Stack>
                </CardContent>
              </Card>

              {/* Customer Guarantee Card */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 2 }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <ShieldCheck size={24} className="text-primary" />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Buyer Protection Active
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      30-day hassle-free return and exchange window.
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
