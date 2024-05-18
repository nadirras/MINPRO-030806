'use client';
import React, { useEffect, useState } from 'react';
import { IEvent } from '@/type/event';
import EventCard from './EventCard'; // Import the component to display individual events

export default function Card() {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
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
        setEvents(responseData.eventData); // Set the array of events
        console.log(responseData.eventData[0].eventSlug);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="py-3 pl-4 z-0">
      <h1 className="text-2xl font-bold">Events</h1>
      {events.map((event) => (
        <EventCard key={event.id} event={event} /> // Render EventCard component for each event
      ))}
    </div>
  );
}
