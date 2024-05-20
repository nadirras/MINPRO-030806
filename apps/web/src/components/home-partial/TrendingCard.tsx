import { IEvent } from '@/type/event';
import React from 'react';

interface EventCardProps {
  event: IEvent;
}

export const TrendingCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl image-full">
      <figure className="h-[20rem]">
        <img
          src={event.eventImage}
          alt="event"
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{event.eventName}</h2>
      </div>
    </div>
  );
};
