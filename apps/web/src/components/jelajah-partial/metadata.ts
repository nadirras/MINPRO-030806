import React from 'react';
import { getEventSlug } from '@/lib/event';
import EventDetail from './EventDetail'; // Import the EventDetail component

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

export default EventDetail; // Export the EventDetail component
