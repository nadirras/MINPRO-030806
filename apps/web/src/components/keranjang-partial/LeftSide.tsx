'use client';
import React, { useState } from 'react';

export default function LeftSide() {
  const [selectedValue, setSelectedValue] = useState('Jenis Kelamin');

  const handleValue = (value: any) => {
    setSelectedValue(value);
  };
  return (
    <div className="flex flex-col mx-4">
      <div className="container">
        <div className="card lg:card-side bg-base-100 shadow-xl mt-3">
          <figure>
            <img
              src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
              alt="Album"
            />
          </figure>
          <div className="card-body">
            <div className="card-body">
              <h2 className="card-title">自由に走れ！</h2>
              <p>Click the button to listen on Spotiwhy app.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Konfirmasi</button>
              </div>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="flex justify-between">
          <p>Jenis Tiket</p>
          <div className="flex gap-2">
            <p>Harga</p>
            <p>Jumlah</p>
          </div>
        </div>
      </div>
      {/* Detail Pemesan */}
      <div className="container">
        <h1 className="text-3xl font-bold my-4 text-primary">Detail Pemesan</h1>
        <div className="card flex flex-col gap-3">
          <label className="input input-bordered flex items-center gap-2">
            Nama
            <input type="text" className="grow" placeholder="Daisy" />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Email
            <input type="text" className="grow" placeholder="daisy@site.com" />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Nomor Ponsel
            <input type="text" className="grow" placeholder="Search" />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <div className="dropdown flex justify-between w-full">
              {/* <button
                id="dropdown-button"
                className="dropdown flex justify-between w-full"
              >
               
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 ml-2 -mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button> */}
              <select
                value={selectedValue}
                onChange={(e) => {
                  setSelectedValue(e.target.value);
                }}
                className="dropdown flex justify-between w-full bg-base-100"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </label>
        </div>
      </div>
      {/* Metode Pembayaran */}
      <div className="container">
        <h1 className="text-3xl font-bold my-4 text-primary">
          Metode Pembayaran
        </h1>
      </div>
    </div>
  );
}
