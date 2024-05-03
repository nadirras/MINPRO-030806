import React from 'react';

export default function Filter() {
  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

        <div className="drawer-side ">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <h1 className="text-2xl font-bold">Filter</h1>
            <div className="divider"></div>
            <ul className="flex flex-col gap-5">
              <li>
                <a>Event Online</a>
              </li>
              <li>
                <details>
                  <summary>Lokasi</summary>
                  <ul className="p-2 bg-base-100 rounded-t-none">
                    <li>
                      <a>Link 1</a>
                    </li>
                    <li>
                      <a>Link 2</a>
                    </li>
                  </ul>
                </details>
              </li>
              <div className="divider"></div>
              <li>
                <details>
                  <summary>Format</summary>
                  <ul className="p-2 bg-base-100 rounded-t-none">
                    <li>
                      <a>Link 1</a>
                    </li>
                    <li>
                      <a>Link 2</a>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <details>
                  <summary>Topik</summary>
                  <ul className="p-2 bg-base-100 rounded-t-none">
                    <li>
                      <a>Link 1</a>
                    </li>
                    <li>
                      <a>Link 2</a>
                    </li>
                  </ul>
                </details>
              </li>
              <div className="divider"></div>
              <li>
                <details>
                  <summary>Waktu</summary>
                  <ul className="p-2 bg-base-100 rounded-t-none">
                    <li>
                      <a>Link 1</a>
                    </li>
                    <li>
                      <a>Link 2</a>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <details>
                  <summary>Opsi Biaya</summary>
                  <ul className="p-2 bg-base-100 rounded-t-none">
                    <li>
                      <a>Berbayar</a>
                    </li>
                    <li>
                      <a>Gratis</a>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
            {/* Sidebar content here */}
            <button className="btn btn-primary mt-4">Apply Filter</button>
          </div>
        </div>
      </div>
    </div>
  );
}
