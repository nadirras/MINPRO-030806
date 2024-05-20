import Dashboard from '@/components/dashboard-partial/Dashboard';
import Link from 'next/link';
import React from 'react';

export default function PageCreator() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        {/* Page content here */}
        <Dashboard />
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <li>
            <Link href="/event-creator">Dashboard</Link>
          </li>
          <li>
            <Link href="/list-event">List Event</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
