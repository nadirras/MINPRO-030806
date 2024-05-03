import LeftSide from '@/components/keranjang-partial/LeftSide';
import RightSide from '@/components/keranjang-partial/RightSide';
import React from 'react';

export default function KeranjangPage() {
  return (
    <div className="keranjang">
      <LeftSide />
      <RightSide />
    </div>
  );
}
