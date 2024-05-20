'use client';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function Input() {
  const [text, setText] = useState('Hello');
  const [value] = useDebounce(text, 1000);

  useEffect(() => {
    console.log(text);
  }, [value]);

  return (
    <div>
      <input
        defaultValue={'Hello'}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <p>Actual value: {text}</p>
      <p>Debounce value: {value}</p>
    </div>
  );
}
