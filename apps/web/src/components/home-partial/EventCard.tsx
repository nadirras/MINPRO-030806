'use client';
import React from 'react';
import { IEvent } from '@/type/event';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '../keranjang-partial/KeranjangCard';

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
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-2">
            {event.eventName}
          </h2>
          <p className="text-lg text-gray-600 mb-1">
            Organized by: {event.eventOrganizer.eventOrganizer}
          </p>
          <p className="text-lg mb-1">
            Ticket Price:{' '}
            <span className="font-semibold">
              {formatCurrency(event.EventPrice.ticketPrice)}
            </span>
          </p>
          <p className="text-lg mb-1">
            Available Seats:{' '}
            <span className="font-semibold">{event.availableSeats}</span>
          </p>
          <p className="text-lg mb-1">
            Location: <span className="font-semibold">{event.location}</span>
          </p>
          <p className="text-lg mb-4">
            Date:{' '}
            <span className="font-semibold">
              {new Date(event.startDate).toLocaleDateString()}
            </span>
          </p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={handleClick}>
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
