'use client';
import React, { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { useAppDispatch } from '@/lib/features/hooks';
import { setEvent } from '@/lib/features/event/eventSlice';
import { createEvent } from '@/lib/event';
import { Province, provinces } from '@/lib/location';
import { GoUpload } from 'react-icons/go';

const EditSchema = yup.object().shape({
  eventCategory: yup.string().required(),
  eventName: yup.string().required(),
  description: yup.string(),
  availableSeats: yup.number(),
  startDate: yup.date().required(),
  endDate: yup.date().required(),
  startTime: yup.string().required(),
  endTime: yup.string().required(),
  zona_waktu: yup.string().required(),
  location: yup.string().required(),
  province: yup.string().required(),
  eventOrganizer: yup.string().required(),
  contactPerson: yup.string().required(),
  contactPersonNumber: yup.string().required(),
  // isPaid: yup.boolean().required(),
  ticketPrice: yup.number().required(),
  eventStatus: yup.string().required(),
});

export default function CreateNewEvent() {
  const [fileEvent, setFileEvent] = useState<File | null>(null);
  const [fileOrganizer, setFileOrganizer] = useState<File | null>(null);

  const [cities, setCities] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  console.log('pongping');
  const onEdit = async (data: any) => {
    try {
      const formattedStartDate = new Date(data.startDate)
        .toISOString()
        .split('T')[0];
      const formattedEndDate = new Date(data.endDate)
        .toISOString()
        .split('T')[0];

      const formData = new FormData();
      formData.set('eventCategory', data.eventCategory);
      formData.set('eventName', data.eventName);
      formData.set('description', data.description);
      formData.set('availableSeats', data.availableSeats);
      formData.set('startDate', formattedStartDate);
      formData.set('endDate', formattedEndDate);
      formData.set('startTime', data.startTime);
      formData.set('endTime', data.endTime);
      formData.set('zona_waktu', data.zona_waktu);
      formData.set('location', data.location);
      formData.set('province', data.province);
      formData.set('eventOrganizer', data.eventOrganizer);
      formData.set('contactPerson', data.contactPerson);
      formData.set('contactPersonNumber', data.contactPersonNumber);
      // formData.set('isPaid', data.isPaid);
      formData.set('eventStatus', data.eventStatus);
      formData.set('ticketPrice', data.ticketPrice);
      if (fileEvent) {
        formData.append('eventImage', fileEvent);
      }
      if (fileOrganizer) {
        formData.append('organizerImage', fileOrganizer);
      }
      // if (file) formData.set('file', file);

      console.log('Form data before sending:', formData);
      console.log(fileEvent);
      console.log(fileOrganizer);
      const res = await createEvent(formData);

      console.log('Response from createEvent:', res);

      if (res.error) {
        console.error('Error posting new event: ', res.error);
        return;
      }
      dispatch(setEvent(res.event));
      alert('Event added successfully');
    } catch (error) {
      console.error('Error on edit createNewEvent:', error);
    }
  };

  const handleProvinceChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean,
    ) => void,
    setCities: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    const selectedProvince = e.target.value as Province;
    setFieldValue('province', selectedProvince);
    setCities(provinces[selectedProvince] || []);
    setFieldValue('city', ''); // Reset city when province changes
  };

  return (
    <Formik
      initialValues={{
        eventCategory: '',
        eventName: '',
        description: '',
        availableSeats: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        zona_waktu: '',
        location: '',
        province: '',
        eventOrganizer: '',
        contactPerson: '',
        contactPersonNumber: '',
        ticketPrice: '',
        eventStatus: '',
        // isPaid: false,
        eventImage: null,
        organizerImage: null,
      }}
      validationSchema={EditSchema}
      onSubmit={(values: any, actions: any) => {
        onEdit(values);
        actions.resetForm();
      }}
    >
      {({ setFieldValue }) => (
        <Form className="flex flex-col gap-2 mx-5 my-5">
          {/* Event Image Upload */}
          <div className="card rounded-t-lg bg-neutral h-96 flex items-center justify-center">
            <label className="flex flex-col justify-center items-center text-xl text-base-100">
              <GoUpload />
              Upload Image
              <input
                type="file"
                name="eventImage"
                className="text-base-100"
                onChange={(e: any) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) {
                    setFileEvent(file);
                  }
                }}
              />
            </label>
            <ErrorMessage
              name="eventImage"
              component="div"
              className="text-sm text-red-500"
            />
          </div>
          {/* General information and organizer */}
          <div className="card bg-base-100 shadow-xl py-3 px-3">
            <label className="input input-lg input-bordered flex items-center gap-2">
              Nama Event
              <Field
                name="eventName"
                type="text"
                className="grow"
                placeholder=""
              />
              <ErrorMessage
                name="eventName"
                component="div"
                className="text-sm text-red-500"
              />
            </label>

            <div className="flex flex-wrap justify-around mt-3">
              <div className="flex flex-col gap-3 ">
                <p className="font-bold">Diselenggarakan oleh</p>
                <div className="flex gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-24">
                      <label>
                        Organizer Image
                        <input
                          type="file"
                          name="organizerImage"
                          onChange={(e: any) => {
                            const fileOrganizer = e.currentTarget.files?.[0];
                            if (fileOrganizer) {
                              setFileOrganizer(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <label className="input input-bordered flex items-center justify-center gap-2">
                    Nama Penyelenggara
                    <Field
                      name="eventOrganizer"
                      type="text"
                      className="grow"
                      placeholder=""
                    />
                    <ErrorMessage
                      name="eventOrganizer"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="font-bold">Tanggal dan Waktu</p>

                <label className="input input-bordered flex items-center gap-2">
                  Tanggal Mulai
                  <Field
                    name="startDate"
                    type="date"
                    className="grow"
                    placeholder=""
                  />
                  <ErrorMessage
                    name="startDate"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  Tanggal Selesai
                  <Field
                    name="endDate"
                    type="date"
                    className="grow"
                    placeholder=""
                  />
                  <ErrorMessage
                    name="endDate"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  Waktu Mulai
                  <Field
                    name="startTime"
                    type="time"
                    className="grow"
                    placeholder=""
                  />
                  <ErrorMessage
                    name="startTime"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  Waktu Selesai
                  <Field
                    name="endTime"
                    type="time"
                    className="grow"
                    placeholder=""
                  />
                  <ErrorMessage
                    name="endTime"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  Zona Waktu
                  <Field
                    as="select"
                    name="zona_waktu"
                    className="grow bg-base-100"
                  >
                    <option value="" label="Pilih zona waktu" />
                    <option value="WIB" label="WIB" />
                    <option value="WITA" label="WITA" />
                    <option value="WIT" label="WIT" />
                  </Field>
                  <ErrorMessage
                    name="zona_waktu"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  Event Status
                  <Field
                    as="select"
                    name="eventStatus"
                    className="grow bg-base-100"
                  >
                    <option value="" label="Pilih event status" />
                    <option value="ComingSoon" label="Coming Soon" />
                    <option value="available" label="Available" />
                    <option value="Finished" label="Finished" />
                  </Field>
                  <ErrorMessage
                    name="eventStatus"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </label>
                <p className="font-bold">Lokasi</p>
                <label className="input input-bordered flex items-center gap-2">
                  Provinsi
                  <Field
                    name="province"
                    as="select"
                    className="grow bg-base-100"
                    onChange={(e: any) =>
                      handleProvinceChange(e, setFieldValue, setCities)
                    }
                  >
                    <option value="" label="Pilih Provinsi" />
                    {(Object.keys(provinces) as Province[]).map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="province"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  Kota
                  <Field
                    name="location"
                    as="select"
                    className="grow bg-base-100"
                  >
                    <option value="" label="Pilih Kota" />
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </label>
              </div>
            </div>
          </div>
          {/* Event Details */}
          <div className="card bg-base-100 shadow-xl">
            <div className="flex flex-wrap justify-between gap-3 mt-3 mb-3 px-3">
              <div className="flex flex-col gap-3">
                <p className="font-bold">Detail Event</p>
                <label className="input input-bordered flex items-center gap-2">
                  Event Category
                  <Field
                    as="select"
                    name="eventCategory"
                    className="grow bg-base-100 "
                  >
                    <option value="" label="Pilih kategori" />
                    <option value="Festival" label="Festival" />
                    <option value="Attraction" label="Attraction" />
                    <option value="Workshop" label="Workshop" />
                    <option value="Seminar" label="Seminar" />
                  </Field>
                  <ErrorMessage
                    name="eventCategory"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  Ketersediaan Kursi
                  <Field
                    name="availableSeats"
                    type="text"
                    className="grow"
                    placeholder=""
                  />
                  <ErrorMessage
                    name="availableSeats"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </label>
                {/* <label className="input input-bordered flex items-center gap-2">
                  Tipe Event
                  <Field as="select" name="isPaid" className="grow bg-base-100">
                    <option value="" label="Pilih kategori" />
                    <option value="true" label="Berbayar" />
                    <option value="false" label="Gratis" />
                  </Field>
                  <ErrorMessage
                    name="isPaid"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </label> */}
                <label className="input input-bordered flex items-center gap-2">
                  Harga Tiket
                  <Field
                    type="text"
                    name="ticketPrice"
                    className="grow bg-base-100"
                  />
                  <ErrorMessage
                    name="ticketPrice"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  Deskripsi Event
                  <Field
                    type="text"
                    name="description"
                    className="grow bg-base-100"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </label>
              </div>
              <div className="flex flex-col gap-3">
                <p className="font-bold">Contact Person</p>
                <label className="input input-bordered flex items-center gap-2">
                  Contact Person
                  <Field
                    type="text"
                    name="contactPerson"
                    className="grow bg-base-100"
                  />
                  <ErrorMessage
                    name="contactPerson"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  Contact Person Number
                  <Field
                    type="text"
                    name="contactPersonNumber"
                    className="grow bg-base-100"
                  />
                  <ErrorMessage
                    name="contactPersonNumber"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </label>
              </div>
            </div>
            <div className="card-actions justify-end mr-3 mb-3">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
