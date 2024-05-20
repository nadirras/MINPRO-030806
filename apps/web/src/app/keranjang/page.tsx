import CartContent from '@/components/keranjang-partial/Content';
import LeftSide from '@/components/keranjang-partial/LeftSide';
import RightSide from '@/components/keranjang-partial/RightSide';
import React from 'react';

export default function KeranjangPage() {
  return (
    <div className="min-h-[60rem] pl-5 pt-5 ">
      <CartContent />
      {/* <LeftSide />
      <RightSide /> */}
    </div>
  );
}
