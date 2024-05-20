'use client';
import React, { useEffect, useState } from 'react';
import { IEvent } from '@/type/event';
import EventCard from './EventCard'; // Import the component to display individual events
// import Cookies from 'js-cookie';
import Link from 'next/link';
import { TrendingCard } from './TrendingCard';

export default function Trending() {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    // const checkLoginStatus = () => {
    //   const loggedIn = Cookies.get('token');
    //   setIsLoggedIn(!!loggedIn);
    // };

    // checkLoginStatus();
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
        const filteredEvents = responseData.eventData.filter(
          (event: any) => event.id === 2 || event.id === 3 || event.id === 7,
        );
        setEvents(filteredEvents); // Set the filtered array of events; // Set the array of events
        // console.log(responseData.eventData[0].eventSlug);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="bg-primary rounded-xl p-5 my-3">
      <h1 className="text-3xl font-bold text-center text-base-100">Trending</h1>
      <div className="flex max-md:flex-col flex-wrap gap-5 p-5  justify-center items-center">
        {events.map((event, index) => (
          <div className="flex  gap-3 ">
            <p className="text-5xl font-bold text-base-100">{index + 1}</p>
            <TrendingCard key={event.id} event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}
