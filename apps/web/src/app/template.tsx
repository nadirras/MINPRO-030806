import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import React from 'react';

export default function Template({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div data-theme="mytheme">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
