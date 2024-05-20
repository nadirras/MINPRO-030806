'use client';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart } from '@/lib/features/cart/cartSlice';
import { RootState } from '@/lib/features/store';
import { KeranjangCard } from '@/components/keranjang-partial/KeranjangCard';
import Link from 'next/link';
import { useAppDispatch } from '@/lib/features/hooks';

const OrderPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const cartStatus = useSelector((state: RootState) => state.cart.status);
  const error = useSelector((state: RootState) => state.cart.error);

  //   console.log('cart:', cart);
  //   console.log('cartStatus', cartStatus);
  //   console.log('error', error);

  useEffect(() => {
    if (cartStatus === 'idle') {
      dispatch(fetchCart());
    }
  }, [cartStatus, dispatch]);

  if (cartStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (cartStatus === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center mb-5">
      <h1 className="text-2xl font-bold mb-4">Order Page</h1>
      {cart &&
      cart.data &&
      cart.data?.cartItems &&
      cart.data?.cartItems.length > 0 ? (
        cart.data?.cartItems.map((item: any) => (
          <KeranjangCard key={item.eventId} cart={item} />
        ))
      ) : (
        <div>Your cart is empty</div>
      )}
      {/* <div className="mt-4">
        <Link href="/checkout">
          <button className="btn btn-primary">Proceed to Checkout</button>
        </Link>
      </div> */}
    </div>
  );
};

export default OrderPage;
