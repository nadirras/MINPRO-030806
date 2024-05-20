'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function VerifikasiRolePage() {
  const params = useParams();
  const router = useRouter();

  const handleVerify = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/users/verify-role/${params.token}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(params.token);
      const data = await res.json();
      console.log(data);
      const token: string = Array.isArray(params.token)
        ? params.token[0]
        : params.token;

      if (!token) {
        console.error('Token is undefined or empty');
        return;
      }

      // Save the token to localStorage
      localStorage.setItem('roleToken', token);
      console.log('token from verifikasi role', token);
      alert('Verify Success!');
      router.push('/profile');
    } catch (error) {
      console.log('verify error (from verifikasi-role):', error);
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
