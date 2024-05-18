import { Key, ReactNode } from 'react';

export interface IEvent {
  eventSlug(arg0: string, eventSlug: any): unknown;
  startDate: string | number | Date;
  location: string; // Ensure location is always a string
  availableSeats: number | null; // Ensure availableSeats is always a number or null
  EventPrice: any;

  eventName: string; // Ensure eventName is always a string
  eventImage: string | undefined;
  id: Key | null | undefined;
  EventData: {
    eventCategory: string;
    eventName: string;
    eventSlug: string;
    eventImage: string;
    description: string;
    availableSeats: number | null;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    zona_waktu: string;
    location: string;
    province: string;
  };
  eventOrganizer: {
    eventOrganizer: string;
    eventImgOrganizer: string;
    contactPerson: string;
    contactPersonNumber: string;
  };
  eventPrice: {
    isPaid: boolean;
    ticketPrice: number | null;
  };
}
