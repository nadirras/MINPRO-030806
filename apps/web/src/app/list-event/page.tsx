'use client';
import { IEvent } from '@/type/event';
import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { GrView } from 'react-icons/gr';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function page() {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          console.log('Login first');
          return;
        }
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;
        const res = await fetch(
          `http://localhost:8000/api/events/users/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }

        const responseData = await res.json();
        setEvents(responseData.events);
        console.log('from list-event:', responseData.events);
      } catch (error) {
        console.log('error from list event', error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center ">
        {/* Page content here */}
        <div>
          <div className="overflow-x-auto flex justify-center mt-4">
            <table className="table w-[50rem]">
              {/* head */}
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama Event</th>
                  <th>Nama Penyelenggara</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{event.eventName}</td>
                    <td>{event.eventOrganizer?.eventOrganizer}</td>
                    <td className="flex gap-2">
                      <Link href={`/list-event/edit-event/${event.eventSlug}`}>
                        <FaEdit />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
