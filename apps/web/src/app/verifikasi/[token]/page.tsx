'use client';
import React from 'react';
import { useParams } from 'next/navigation';

export default function VerifyPage() {
  const params = useParams();

  const handleVerify = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/users/verify', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${params.token}`,
        },
      });
      const data = await res.json();
      console.log(data);
      alert('Verify Success!');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-screen flex flex-col gap-2 justify-center items-center">
      <h1 className="text-3xl font-bold">Please verify here:</h1>
      <button className="btn btn-primary" onClick={handleVerify}>
        Verify
      </button>
    </div>
  );
}

