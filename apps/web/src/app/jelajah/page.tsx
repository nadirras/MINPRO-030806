import Content from '@/components/jelajah-partial/Content';
import Filter from '@/components/jelajah-partial/Filter';
import React from 'react';

export default function JelajahPage() {
  return (
    <div className="flex gap-3">
      <Filter />
      <Content />
    </div>
  );
}
