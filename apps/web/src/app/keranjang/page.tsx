import CartContent from '@/components/keranjang-partial/Content';
import LeftSide from '@/components/keranjang-partial/LeftSide';
import RightSide from '@/components/keranjang-partial/RightSide';
import React from 'react';
import Link from 'next/link';

export default function KeranjangPage() {
  return (
    <div className="min-h-[60rem] pl-5 pt-5 flex flex-col justify-center items-center">
      <CartContent />
      <div className="card-actions justify-end">
        <Link href="/order" className="btn btn-primary">
          Order
        </Link>
      </div>
      {/* <LeftSide />
      <RightSide /> */}
    </div>
  );
}
