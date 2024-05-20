'use client';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { KeranjangCard } from './KeranjangCard';
import { ICart } from '@/type/cart';
import { useDispatch } from 'react-redux';
import { setCart } from '@/lib/features/cart/cartSlice'; // Import setCart action

export default function CartContent() {
  const [cartData, setCartData] = useState<ICart | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        const res = await fetch('http://localhost:8000/api/carts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch carts');
        }

        const responseData = await res.json();
        setCartData(responseData.data);
        dispatch(setCart(responseData.data)); // Dispatch setCart with fetched data
        console.log('from keranjang:', responseData.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <div className="flex flex-col ">
      <h1 className="text-2xl font-bold text-primary">Keranjang</h1>
      <div className="divider"></div>
      <div>
        {cartData?.cartItems.map((item) => (
          <KeranjangCard key={item.cartItemId} cart={item} />
        ))}
      </div>
    </div>
  );
}
