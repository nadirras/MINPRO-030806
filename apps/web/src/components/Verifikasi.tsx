'use client';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Verifikasi() {
  const [verificationStatus, setVerificationStatus] = useState('');
  const location = useLocation();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token) {
      handleVerification(token);
    }
  }, [location.search]);

  const handleVerification = async (token: any) => {
    try {
      const response = await fetch('http://localhost:8000/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setVerificationStatus(data.message);
    } catch (error) {
      console.log(error);
      setVerificationStatus('Failed to verify account');
    }
  };

  return (
    <div>
      <h1>Account Verification</h1>
      <p>Click the button below to verify your account:</p>
      <button onClick={handleVerification}>Verify Account</button>
      <p>{verificationStatus}</p>
    </div>
  );
}