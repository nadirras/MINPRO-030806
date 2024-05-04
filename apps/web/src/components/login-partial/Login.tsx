'use client';
import Link from 'next/link';
import React from 'react';

export default function Login() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <h1 className="text-3xl font-bold p-9">Login</h1>
        <div className="card-body">
          <label className="input input-bordered flex items-center gap-2">
            Name
            <input type="text" className="grow" placeholder="Daisy" />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Password
            <input type="password" className="grow" placeholder="*****" />
          </label>
          <p>Forgot password?</p>
          <p>
            Didn't have account?{' '}
            <span className="text-primary">
              <Link href="/register">Register</Link>
            </span>
          </p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}
