'use client';

import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { useAuth } from '@clerk/nextjs';
import { makeStore, AppStore } from './store';
import { hydrateCart, selectCartItems, selectIsCartHydrated } from './cartSlice';
import { useAppDispatch, useAppSelector } from './hooks';

const GUEST_STORAGE_KEY = 'nova_cart_guest';

function getCartStorageKey(userId?: string | null): string {
  return userId ? `nova_cart_user_${userId}` : GUEST_STORAGE_KEY;
}

function CartAuthSync({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded } = useAuth();
  const dispatch = useAppDispatch();
  const activeKeyRef = useRef<string | null>(null);
  const items = useAppSelector(selectCartItems);
  const isHydrated = useAppSelector(selectIsCartHydrated);

  // 1. Rehydrate cart state whenever active user/account changes
  useEffect(() => {
    if (!isLoaded) return;

    const targetKey = getCartStorageKey(userId);

    if (activeKeyRef.current !== targetKey) {
      activeKeyRef.current = targetKey;

      try {
        const savedItems = localStorage.getItem(targetKey);
        if (savedItems) {
          const parsed = JSON.parse(savedItems);
          dispatch(hydrateCart(Array.isArray(parsed) ? parsed : []));
        } else {
          // If user signs in and user cart is empty, carry over guest cart items
          const guestSaved = localStorage.getItem(GUEST_STORAGE_KEY);
          if (userId && guestSaved) {
            const parsedGuest = JSON.parse(guestSaved);
            if (Array.isArray(parsedGuest) && parsedGuest.length > 0) {
              dispatch(hydrateCart(parsedGuest));
              localStorage.setItem(targetKey, JSON.stringify(parsedGuest));
              localStorage.removeItem(GUEST_STORAGE_KEY);
            } else {
              dispatch(hydrateCart([]));
            }
          } else {
            dispatch(hydrateCart([]));
          }
        }
      } catch (e) {
        console.error('Failed to hydrate user-scoped cart:', e);
        dispatch(hydrateCart([]));
      }
    }
  }, [userId, isLoaded, dispatch]);

  // 2. Persist Redux cart updates to active user storage key
  useEffect(() => {
    if (!isLoaded || !isHydrated) return;

    const currentKey = getCartStorageKey(userId);
    try {
      localStorage.setItem(currentKey, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart to localStorage:', e);
    }
  }, [items, userId, isLoaded, isHydrated]);

  return <>{children}</>;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <CartAuthSync>{children}</CartAuthSync>
    </Provider>
  );
}
