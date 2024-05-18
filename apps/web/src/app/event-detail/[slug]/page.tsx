import React from 'react';
import { getEvent, getEventSlug } from '@/lib/event';
import { IEvent } from '@/type/event';

interface EventDetailParams {
  slug: string;
}

export const revalidate = 3600;

export const generateStaticParams = async () => {
  const data = await getEvent();

  return data.eventData?.map((event: IEvent) => ({
    params: {
      slug: event?.eventSlug,
    },
  }));
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getEventSlug(params.slug);

  return {
    title: data.events?.eventName,
  };
}

export default async function EventInSlug({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getEventSlug(params.slug);

  return (
    <div className="h-screen mt-9 p-5">
      <div className="flex justify-center ">
        <div className="card flex flex-col w-96 bg-base-100 shadow-xl text-center">
          <figure className="w-auto h-96 border-2 border-primary">
            {data.events?.eventImage ? (
              <img src={data.events?.eventImage} alt={data.events?.eventName} />
            ) : (
              <div className="text-placeholder">No Image Available</div>
            )}
          </figure>
          <h1>Name: {data.events?.eventName}</h1>
          <p>Location: {data.events?.location}</p>
          <p>Province: {data.events?.province}</p>
          <p>
            Tanggal: {data.events?.startDate} - {data.events?.endDate}
          </p>
          <p>
            Waktu: {data.events?.startTime} - {data.events?.endTime}{' '}
            {data.events?.zona_waktu}
          </p>
          <p>Ketersediaan kursi: {data.events?.availableSeats}</p>
          <p>Event organizer: {data.eventOrganizer?.eventOrganizer}</p>
        </div>
      </div>
    </div>
  );
}
