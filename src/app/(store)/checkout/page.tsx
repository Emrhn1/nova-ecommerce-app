'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  Lock,
  Tag,
  CheckCircle2,
  ShoppingBag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTotalQuantity,
  clearCart,
} from '@/lib/redux/cartSlice';
import { createOrderAction } from '@/app/actions/checkout';

const FREE_SHIPPING_THRESHOLD = 150;
const TAX_RATE = 0.08;
const STEPS = ['Shipping Address', 'Shipping Method', 'Payment & Place Order'];

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoaded: isUserLoaded } = useUser();

  const cartItems = useAppSelector(selectCartItems);
  const cartSubtotal = useAppSelector(selectCartSubtotal);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);

  // Stepper State
  const [activeStep, setActiveStep] = useState(0);

  // Form State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Turkey',
    saveAddress: true,
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  const [paymentInfo, setPaymentInfo] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscountRate, setAppliedDiscountRate] = useState<number>(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Prefill user details once Clerk is loaded
  useEffect(() => {
    if (user) {
      const email =
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        '';
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      setShippingAddress((prev) => ({
        ...prev,
        email: prev.email || email,
        fullName: prev.fullName || fullName,
      }));
      setPaymentInfo((prev) => ({
        ...prev,
        cardHolder: prev.cardHolder || fullName,
      }));
    }
  }, [user]);

  // Pricing calculations
  const standardShippingCost = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15;
  const shippingCost = shippingMethod === 'express' ? 15 : standardShippingCost;
  const discountAmount = cartSubtotal * appliedDiscountRate;
  const taxCost = cartSubtotal * TAX_RATE;
  const totalCost = Math.max(0, cartSubtotal - discountAmount + shippingCost + taxCost);

  // Promo application
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'NOVA10') {
      setAppliedDiscountRate(0.1);
      setPromoSuccess('10% discount applied!');
    } else if (code === 'WELCOME20') {
      setAppliedDiscountRate(0.2);
      setPromoSuccess('20% welcome discount applied!');
    } else {
      setPromoError('Invalid code. Try NOVA10 or WELCOME20.');
    }
  };

  // Card Formatters
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setPaymentInfo((prev) => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: '' }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setPaymentInfo((prev) => ({ ...prev, expiryDate: raw }));
    if (errors.expiryDate) setErrors((prev) => ({ ...prev, expiryDate: '' }));
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPaymentInfo((prev) => ({ ...prev, cvc: raw }));
    if (errors.cvc) setErrors((prev) => ({ ...prev, cvc: '' }));
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingAddress.email.trim() || !/\S+@\S+\.\S+/.test(shippingAddress.email))
      newErrors.email = 'Valid email is required';
    if (!shippingAddress.phone.trim() || shippingAddress.phone.length < 7)
      newErrors.phone = 'Valid phone number is required';
    if (!shippingAddress.street.trim()) newErrors.street = 'Street address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    const rawCard = paymentInfo.cardNumber.replace(/\s+/g, '');
    if (!paymentInfo.cardHolder.trim()) newErrors.cardHolder = 'Cardholder name is required';
    if (rawCard.length !== 16) newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(paymentInfo.expiryDate))
      newErrors.expiryDate = 'Valid expiry date (MM/YY) required';
    if (paymentInfo.cvc.length < 3) newErrors.cvc = 'Valid 3 or 4-digit CVC required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!validateStep1()) return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Submit Order
  const handlePlaceOrder = async () => {
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const orderPayload = {
        shippingAddress,
        shippingMethod,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
        promoCode: appliedDiscountRate > 0 ? promoCode : undefined,
        discountAmount,
      };

      const result = await createOrderAction(orderPayload);

      if (result.success && result.orderId) {
        // Redirect to success page. Cart is cleared by <ClearCartOnSuccess /> on the destination page
        // to prevent premature flashing of the empty cart view during navigation.
        router.push(`/checkout/success/${result.orderId}`);
      } else {
        setServerError(result.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setServerError(err.message || 'An unexpected network error occurred.');
      setIsSubmitting(false);
    }
  };

  // If cart is empty and user is not currently submitting/redirecting
  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            color: 'text.secondary',
          }}
        >
          <ShoppingBag size={40} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
          Your Bag is Empty
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          You need at least one item in your shopping bag to proceed to checkout.
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          href="/products"
          startIcon={<ArrowLeft size={18} />}
          sx={{ py: 1.5, px: 4, fontWeight: 700 }}
        >
          Explore Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/cart"
          startIcon={<ArrowLeft size={16} />}
          sx={{ color: 'text.secondary', mb: 1.5, p: 0, '&:hover': { bgcolor: 'transparent', color: 'text.primary' } }}
        >
          Return to Cart
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Checkout
        </Typography>
      </Box>

      {/* Stepper */}
      <Box sx={{ mb: 5, maxWidth: 650 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {serverError && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }} onClose={() => setServerError(null)}>
          {serverError}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Column: Multi-Step Interactive Form */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={3}>
            {/* Step 0: Shipping Address */}
            {activeStep === 0 && (
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <MapPin size={22} className="text-primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      1. Contact & Shipping Address
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Full Name"
                        value={shippingAddress.fullName}
                        onChange={(e) => {
                          setShippingAddress({ ...shippingAddress, fullName: e.target.value });
                          if (errors.fullName) setErrors({ ...errors, fullName: '' });
                        }}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        type="email"
                        label="Email Address"
                        value={shippingAddress.email}
                        onChange={(e) => {
                          setShippingAddress({ ...shippingAddress, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Phone Number"
                        placeholder="+90 555 123 4567"
                        value={shippingAddress.phone}
                        onChange={(e) => {
                          setShippingAddress({ ...shippingAddress, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Street Address"
                        placeholder="Street, apartment, suite, etc."
                        value={shippingAddress.street}
                        onChange={(e) => {
                          setShippingAddress({ ...shippingAddress, street: e.target.value });
                          if (errors.street) setErrors({ ...errors, street: '' });
                        }}
                        error={!!errors.street}
                        helperText={errors.street}
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="City"
                        value={shippingAddress.city}
                        onChange={(e) => {
                          setShippingAddress({ ...shippingAddress, city: e.target.value });
                          if (errors.city) setErrors({ ...errors, city: '' });
                        }}
                        error={!!errors.city}
                        helperText={errors.city}
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="State / Province"
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, state: e.target.value })
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Postal / ZIP Code"
                        value={shippingAddress.postalCode}
                        onChange={(e) => {
                          setShippingAddress({ ...shippingAddress, postalCode: e.target.value });
                          if (errors.postalCode) setErrors({ ...errors, postalCode: '' });
                        }}
                        error={!!errors.postalCode}
                        helperText={errors.postalCode}
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Country"
                        value={shippingAddress.country}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, country: e.target.value })
                        }
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={shippingAddress.saveAddress}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                saveAddress: e.target.checked,
                              })
                            }
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Save this shipping address to my account
                          </Typography>
                        }
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleNext}
                      sx={{ px: 4, py: 1.25, fontWeight: 700 }}
                    >
                      Continue to Shipping Method
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Step 1: Shipping Method */}
            {activeStep === 1 && (
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Truck size={22} className="text-primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      2. Choose Shipping Method
                    </Typography>
                  </Box>

                  <RadioGroup
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value as 'standard' | 'express')}
                  >
                    <Stack spacing={2}>
                      {/* Standard Shipping Card */}
                      <Card
                        variant="outlined"
                        onClick={() => setShippingMethod('standard')}
                        sx={{
                          cursor: 'pointer',
                          borderColor: shippingMethod === 'standard' ? 'primary.main' : 'divider',
                          bgcolor: shippingMethod === 'standard' ? 'action.selected' : 'background.paper',
                          transition: 'all 0.2s ease',
                          '&:hover': { borderColor: 'primary.light' },
                        }}
                      >
                        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Radio checked={shippingMethod === 'standard'} value="standard" />
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Standard Delivery
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Estimated 3-5 business days
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {standardShippingCost === 0 ? 'FREE' : `$${standardShippingCost.toFixed(2)}`}
                          </Typography>
                        </Box>
                      </Card>

                      {/* Express Shipping Card */}
                      <Card
                        variant="outlined"
                        onClick={() => setShippingMethod('express')}
                        sx={{
                          cursor: 'pointer',
                          borderColor: shippingMethod === 'express' ? 'primary.main' : 'divider',
                          bgcolor: shippingMethod === 'express' ? 'action.selected' : 'background.paper',
                          transition: 'all 0.2s ease',
                          '&:hover': { borderColor: 'primary.light' },
                        }}
                      >
                        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Radio checked={shippingMethod === 'express'} value="express" />
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                  Express Priority Delivery
                                </Typography>
                                <Chip
                                  label="Fastest"
                                  size="small"
                                  color="primary"
                                  sx={{ height: 18, fontSize: '0.65rem' }}
                                />
                              </Box>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Guaranteed 1-2 business days with live tracking
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            $15.00
                          </Typography>
                        </Box>
                      </Card>
                    </Stack>
                  </RadioGroup>

                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="outlined" onClick={handleBack} sx={{ px: 3 }}>
                      Back to Address
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleNext}
                      sx={{ px: 4, py: 1.25, fontWeight: 700 }}
                    >
                      Continue to Payment
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment & Final Review */}
            {activeStep === 2 && (
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <CreditCard size={22} className="text-primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      3. Secure Payment Details
                    </Typography>
                  </Box>

                  <Alert severity="info" icon={<Lock size={18} />} sx={{ mb: 3, borderRadius: 1.5 }}>
                    This is a secure simulation checkout. You can enter any 16-digit card number (e.g. 4000
                    1234 5678 9010) with valid future expiry.
                  </Alert>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Cardholder Name"
                        value={paymentInfo.cardHolder}
                        onChange={(e) => {
                          setPaymentInfo({ ...paymentInfo, cardHolder: e.target.value });
                          if (errors.cardHolder) setErrors({ ...errors, cardHolder: '' });
                        }}
                        error={!!errors.cardHolder}
                        helperText={errors.cardHolder}
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Card Number"
                        placeholder="4000 0000 0000 0000"
                        value={paymentInfo.cardNumber}
                        onChange={handleCardNumberChange}
                        error={!!errors.cardNumber}
                        helperText={errors.cardNumber}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <CreditCard size={18} />
                              </InputAdornment>
                            ),
                          },
                        }}
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Expiry Date"
                        placeholder="MM/YY"
                        value={paymentInfo.expiryDate}
                        onChange={handleExpiryChange}
                        error={!!errors.expiryDate}
                        helperText={errors.expiryDate}
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="CVC / CVV"
                        placeholder="123"
                        value={paymentInfo.cvc}
                        onChange={handleCvcChange}
                        error={!!errors.cvc}
                        helperText={errors.cvc}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock size={16} />
                              </InputAdornment>
                            ),
                          },
                        }}
                        required
                      />
                    </Grid>
                  </Grid>

                  {/* Shipping Address Recap */}
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      DELIVERY DESTINATION
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {shippingAddress.fullName} ({shippingAddress.phone})
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                      {shippingAddress.country}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="outlined" onClick={handleBack} disabled={isSubmitting} sx={{ px: 3 }}>
                      Back to Shipping
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <Lock size={18} />}
                      sx={{ px: 4, py: 1.25, fontWeight: 700 }}
                    >
                      {isSubmitting ? 'Processing Order...' : `Pay $${totalCost.toFixed(2)}`}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>

        {/* Right Column: Sticky Order Summary */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3} sx={{ position: { md: 'sticky' }, top: { md: 100 } }}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5 }}>
                  Order Summary ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})
                </Typography>

                {/* Items preview */}
                <Stack spacing={2} sx={{ mb: 3, maxHeight: 260, overflowY: 'auto', pr: 0.5 }}>
                  {cartItems.map(({ product, quantity }) => (
                    <Box key={product.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Box
                        component="img"
                        src={product.imageUrl}
                        alt={product.title}
                        sx={{
                          width: 54,
                          height: 54,
                          borderRadius: 1,
                          objectFit: 'cover',
                          bgcolor: 'action.hover',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
                          {product.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Qty: {quantity} × ${product.price.toFixed(2)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        ${(product.price * quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Promo Code Input */}
                <Box component="form" onSubmit={handleApplyPromo} sx={{ mb: 2.5 }}>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Promo code (e.g. NOVA10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      error={!!promoError}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Tag size={16} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <Button variant="outlined" type="submit" sx={{ px: 2, whiteSpace: 'nowrap' }}>
                      Apply
                    </Button>
                  </Stack>
                  {promoError && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {promoError}
                    </Typography>
                  )}
                  {promoSuccess && (
                    <Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: 'block', fontWeight: 600 }}>
                      {promoSuccess}
                    </Typography>
                  )}
                </Box>

                {/* Cost Breakdown */}
                <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Subtotal
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${cartSubtotal.toFixed(2)}
                    </Typography>
                  </Box>

                  {appliedDiscountRate > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
                      <Typography variant="body2">Discount ({(appliedDiscountRate * 100)}%)</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        -${discountAmount.toFixed(2)}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Shipping ({shippingMethod === 'express' ? 'Express' : 'Standard'})
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Estimated Tax (8%)
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${taxCost.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Total */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Total
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    ${totalCost.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 2 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <ShieldCheck size={18} className="text-primary" />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    256-bit SSL Encrypted Secure Checkout
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Clock size={18} className="text-primary" />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Dispatch within 24 hours guaranteed
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
