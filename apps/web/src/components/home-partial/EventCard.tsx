'use client';
import React from 'react';
import { IEvent } from '@/type/event';
import { useRouter } from 'next/navigation';

interface EventCardProps {
  event: IEvent;
  isLoggedIn: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, isLoggedIn }) => {
  const router = useRouter();

  const handleClick = () => {
    if (isLoggedIn) {
      router.push(`/event-detail/${event.eventSlug}`);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="card card-compact w-[20rem] bg-base-100 shadow-xl">
      <figure className="max-h-[10rem]">
        <img
          src={event.eventImage}
          alt={event.eventName}
          className="object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="font-bold text-xl">{event.eventName}</h2>
        <p>{event.eventOrganizer.eventOrganizer}</p>
        <p>Ticket Price: {event.EventPrice.ticketPrice}</p>
        <p>Available Seats: {event.availableSeats}</p>
        <p>Location: {event.location}</p>
        <p>Date: {new Date(event.startDate).toLocaleDateString()}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={handleClick}>
            Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
