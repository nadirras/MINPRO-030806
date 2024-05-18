'use client';
import React from 'react';
import Link from 'next/link'; // Import Link from Next.js
import { IEvent } from '@/type/event';

interface Props {
  event: IEvent;
}

const EventCard: React.FC<Props> = ({ event }) => {
  console.log(event);
  console.log('slug', event?.eventSlug);
  return (
    <div className="card card-compact w-96 bg-base-100 shadow-xl">
      <figure>
        <img src={event.eventImage} />
      </figure>
      <div className="card-body">
        <h2>{event.eventName}</h2>
        <p>{event.eventOrganizer.eventOrganizer}</p>
        <p>Ticket Price: {event.EventPrice.ticketPrice}</p>
        <p>Available Seats: {event.availableSeats}</p>
        <p>Location: {event.location}</p>
        <p>Date: {new Date(event.startDate).toLocaleDateString()}</p>
        <div className="card-actions justify-end">
          <Link
            href={`/event-detail/${event?.eventSlug}`}
            className="btn btn-primary"
          >
            Detail{' '}
          </Link>
          {/* <Link href={`/event-detail/${event.EventData.eventSlug}`}>
            <a className="btn btn-primary">Detail</a>
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
