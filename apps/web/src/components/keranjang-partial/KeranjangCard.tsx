'use client';
import {
  clearCartItem,
  setCart,
  updateCartItem,
} from '@/lib/features/cart/cartSlice';
import { useAppDispatch } from '@/lib/features/hooks';
import { ICartItem } from '@/type/cart';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
interface KeranjangCardProps {
  cart: ICartItem;
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
};
export const KeranjangCard: React.FC<KeranjangCardProps> = ({ cart }) => {
  const [quantity, setQuantity] = useState(cart.quantity);
  const dispatch = useAppDispatch();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0) return;

    try {
      const token = Cookies.get('token');
      const res = await fetch('http://localhost:8000/api/carts/update-cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: cart.eventId,
          quantity: newQuantity,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update cart');
      }

      const updatedItem = await res.json();
      setQuantity(updatedItem.quantity);

      // Otherwise, update the cart item
      dispatch(updateCartItem(updatedItem));
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  return (
    <div className="card bg-base-100 w-[40rem] max-md:w-[80%] max-sm:w-[50%] shadow-xl ">
      <div className="card bg-white w-[40rem] max-md:w-[95%] shadow-lg rounded-lg overflow-hidden mb-4 ">
        <div className="card-body p-4 flex flex-col ">
          <div className="flex items-center justify-between mb-2">
            <h2 className="card-title text-xl font-bold text-gray-800">
              {cart.eventName}
            </h2>
            <span className="text-sm text-gray-500">{cart.eventCategory}</span>
          </div>
          <div className="flex max-sm:flex-col items-center justify-between mb-4">
            <div>
              <p className="text-lg font-semibold text-gray-600">
                Harga Tiket:
              </p>
              <p className="text-lg text-gray-800">
                {formatCurrency(cart.ticketPrice)}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-600">Jumlah:</p>
              <div className="flex items-center">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  -
                </button>
                <input
                  type="text"
                  className="input input-sm text-center mx-2 w-12"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                />
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-gray-800">Total:</p>
            <p className="text-xl font-bold text-gray-800">
              {formatCurrency(cart.ticketPrice * quantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
