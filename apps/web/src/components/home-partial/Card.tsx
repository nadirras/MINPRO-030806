'use client';
import React, { useEffect, useState } from 'react';
import { IEvent } from '@/type/event';
import EventCard from './EventCard'; // Import the component to display individual events
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function Card() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = Cookies.get('token');
      setIsLoggedIn(!!loggedIn);
    };

    checkLoginStatus();
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/events`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }

        const responseData = await res.json();
        setEvents(responseData.eventData.slice(0, 3)); // Set the array of events
        // console.log(responseData.eventData[0].eventSlug);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="py-3 pl-4 z-0 " id="events">
      <h1 className="text-5xl font-bold text-center my-3">Events</h1>

      <div className="flex justify-center items-center gap-3 flex-wrap">
        {events.map((event) => (
          <EventCard key={event.id} event={event} isLoggedIn={isLoggedIn} /> // Render EventCard component for each event
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Link
          href="/jelajah"
          className="btn btn-primary btn-lg transition-transform transform hover:scale-105 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-2xl"
        >
          View All Events
        </Link>
      </div>
    </div>
  );
}
