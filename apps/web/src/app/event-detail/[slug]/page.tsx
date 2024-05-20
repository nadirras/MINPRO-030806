import React from 'react';
import { getEvent, getEventSlug } from '@/lib/event';
import { IEvent } from '@/type/event';
import { UseDispatch } from 'react-redux';
import { addToCart } from '@/lib/features/cart/cartSlice';
import { useRouter } from 'next/navigation';
import AddToCartButton from '@/components/jelajah-partial/AddToCartButton';

interface EventDetailParams {
  slug: string;
}

export const revalidate = 3600;

export const generateStaticParams = async () => {
  const data = await getEvent();

  return data.eventData?.map((event: IEvent) => ({
    slug: event?.eventSlug,
  }));
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getEventSlug(params.slug);

  return {
    title: data.eventData?.eventName,
  };
}

export default async function EventInSlug({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getEventSlug(params.slug);

  return (
    <div className="flex justify-center my-5">
      <div className="card flex flex-col w-[30rem] bg-base-100 shadow-xl p-5">
        <figure className="w-full h-96 border-2 border-primary overflow-hidden rounded-lg">
          {data.eventData?.eventImage ? (
            <img
              src={data.eventData?.eventImage}
              alt={data.eventData?.eventName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-placeholder">
              No Image Available
            </div>
          )}
        </figure>
        <div className="card-body p-4">
          <h1 className="card-title text-2xl font-bold text-primary mb-2">
            {data.eventData?.eventName}
          </h1>
          <div className="mb-4 text-left">
            <p className="text-lg">
              <span className="font-semibold">Lokasi:</span>{' '}
              {data.eventData?.location}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Provinsi:</span>{' '}
              {data.eventData?.province}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Kategori Event:</span>{' '}
              {data.eventData?.eventCategory}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Tanggal:</span>{' '}
              {new Date(data.eventData?.startDate).toLocaleDateString('id', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}{' '}
              -{' '}
              {new Date(data.eventData?.endDate).toLocaleDateString('id', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Waktu:</span>{' '}
              {data.eventData?.startTime} - {data.eventData?.endTime}{' '}
              {data.eventData?.zona_waktu}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Ketersediaan kursi:</span>{' '}
              {data.eventData?.availableSeats}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <figure className="w-24 h-24 rounded-full overflow-hidden border-2 border-secondary">
              {data.eventData?.eventOrganizer?.eventImgOrganizer ? (
                <img
                  src={data.eventData?.eventOrganizer?.eventImgOrganizer}
                  alt={data.eventData?.eventOrganizer?.eventOrganizer}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-placeholder">
                  No Image Available
                </div>
              )}
            </figure>
            <div className="flex flex-col text-left">
              <p className="text-lg font-semibold">Event Organizer:</p>
              <p>{data.eventData?.eventOrganizer?.eventOrganizer}</p>
              <p>
                <span className="font-semibold">Contact Person:</span>{' '}
                {data.eventData?.eventOrganizer?.contactPerson}
              </p>
              <p>
                <span className="font-semibold">Contact Number:</span>{' '}
                {data.eventData?.eventOrganizer?.contactPersonNumber}
              </p>
            </div>
          </div>
        </div>
        <div className="card-actions justify-end">
          {/* <button className="btn btn-primary">Booking Tiket</button> */}
          <AddToCartButton slug={data.eventData?.eventSlug} />
        </div>
      </div>
    </div>
  );
}
