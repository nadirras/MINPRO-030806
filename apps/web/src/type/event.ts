export interface IEvent {
  id: number;
  eventName: string;
  eventPrice: number;
  eventOrganizer: string;
  eventCategory: boolean;
  availableSeats: number;
  contactPerson: string;
  isPaid: boolean;
}
