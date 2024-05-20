import { createSlice } from '@reduxjs/toolkit';

export interface EventSlice {
  value: {
    eventOrganizer: string;
    contactPerson: string;
    contactPersonNumber: string;
    eventCategory: string;
    eventName: string;
    description: string;
    availableSeats: number | null;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    zona_waktu: string;
    location: string;
    province: string;
    isPaid: boolean;
    ticketPrice: number | null;
  } | null;
}

const initialState: EventSlice = {
  value: null,
};
export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEvent: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setEvent } = eventSlice.actions;
