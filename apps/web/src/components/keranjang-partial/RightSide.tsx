import React from 'react';

export default function RightSide() {
  return (
    <div>
      <div className="shadow-xl">
        <div className="card-body">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Masukkan kode promo"
              className="input input-bordered w-full max-w-xs"
            />
            <button className="btn btn-primary">Terapkan</button>
          </div>
          <h1 className="text-3xl font-bold">Detail Harga</h1>
          <div className="flex justify-between">
            <div className="grid grid-rows-2">
              <p>Total Harga Tiket</p>
              <p>Biaya Platform</p>
            </div>

            <div className="grid grid-rows-2">
              <p>Rp1.000.000</p>
              <p>Rp100.000</p>
            </div>
          </div>
          <div className="divider divider-primary"></div>
          <div className="flex justify-between">
            <div className="grid grid-rows-1">
              <p>Total Bayar</p>
            </div>
            <div className="grid grid-rows-1">
              <p>Rp1.100.000</p>
            </div>
          </div>
          {/* <div className="flex justify-between w-full">
            <p>Total Harga Tiket</p>
            <p>Rp1.000.000</p>
          </div>
          <div className="flex justify-between w-full">
            <p>Biaya Platform</p>
            <p>Rp100.000</p>
          </div>
          <div className="divider"></div>
          <div className="flex justify-between w-full">
            <p>Total Bayar</p>
            <p>Rp1.100.000</p>
          </div> */}
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Bayar Tiket</button>
          </div>
        </div>
      </div>
    </div>
  );
}
