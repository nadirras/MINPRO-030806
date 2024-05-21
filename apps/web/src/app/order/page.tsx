'use client';
import React from 'react';
import OrderPageCombine from '@/components/keranjang-partial/OrderPageCombineComponent';

const OrderPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4">Create Order</h1>
      <OrderPageCombine />
    </div>
  );
};

export default OrderPage;
