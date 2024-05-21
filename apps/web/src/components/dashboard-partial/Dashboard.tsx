'use client';
import React, { useEffect, useState } from 'react';
import { getDashboard } from '@/lib/event';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const DashboardPage = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const token = Cookies.get('token');

  if (!token) {
    console.log('Login first');
    return null; // Return null instead of rendering anything if not logged in
  }

  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const userId = decodedToken.id;

  useEffect(() => {
    async function fetchData() {
      const data = await getDashboard();
      setOrganizers(data || []); // Set organizers to an empty array if data is undefined
      setLoading(false);
    }

    fetchData();
  }, [userId]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizers.map((organizer) => (
          <div key={organizer.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="font-bold text-xl mb-2">
                {organizer.organizerName}
              </h2>
              <div className="flex flex-wrap justify-between">
                {organizer?.events.map((event: any) => (
                  <div
                    key={event.id}
                    className="card bg-base-200 shadow-md  mb-4"
                  >
                    <div className="card-body">
                      <h3 className="font-bold text-lg">{event.eventName}</h3>
                      <div>
                        <p>Total Registrations: {event.totalRegistrations}</p>
                        <p>
                          Total Failed Registrations:{' '}
                          {event.totalFailedRegistrations}
                        </p>
                      </div>
                      <p className="mt-2">
                        Total Revenue: Rp {event.totalRevenue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DashboardPage;
