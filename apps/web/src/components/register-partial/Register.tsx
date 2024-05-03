import React from 'react';
import Link from 'next/link';

export default function Register() {
  return (
    <div>
      <div className="h-screen flex justify-center items-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <h1 className="text-3xl font-bold p-9">Register</h1>
          <div className="card-body">
            <label className="input input-bordered flex items-center gap-2">
              Name
              <input type="text" className="grow" placeholder="Daisy" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              Email
              <input
                type="text"
                className="grow"
                placeholder="cetewindt@mail.com"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              Password
              <input type="password" className="grow" placeholder="*****" />
            </label>

            <p>
              Already have account?{' '}
              <span>
                <Link href="/login">Login</Link>
              </span>
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Register</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
