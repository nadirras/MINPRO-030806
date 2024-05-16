'use client';

import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/features/hooks';
import { updateUser } from '@/lib/user';
import { setUser } from '@/lib/features/user/userSlice';
import Cookies from 'js-cookie';
import { createToken } from '@/app/action';
import { IUser } from './MainProfile';

const EditSchema = yup.object().shape({
  nama_depan: yup.string(),
  nama_belakang: yup.string(),
  jenis_kelamin: yup.string(),
  tanggal_lahir: yup.date(),
  nomor_telepon: yup.string(),
});

export default function EditProfile() {
  const [isUser, setIsUser] = useState<IUser | null>(null);
  const token = useAppSelector((state) => state.user.value);
  const [file, setFile] = useState<File | null>(null);
  const search = useSearchParams();
  //   const redirect = search.get('redirect') || '/profile';
  const dispatch = useAppDispatch();

  const onEdit = async (data: any) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const tanggalLahirDate = new Date(data.tanggal_lahir);
      if (isNaN(tanggalLahirDate.getTime())) {
        console.error('Invalid date format');
        return;
      }

      const formattedTanggalLahir = tanggalLahirDate
        .toISOString()
        .split('T')[0];

      const formData = new FormData();
      formData.set('nama_depan', data.nama_depan);
      formData.set('nama_belakang', data.nama_belakang);
      formData.set('jenis_kelamin', data.jenis_kelamin);
      formData.set('tanggal_lahir', formattedTanggalLahir);
      formData.set('nomor_telepon', data.nomor_telepon);
      if (file) {
        formData.set('file', file);
      }

      const res = await updateUser(formData, token);
      if (res.error) {
        console.error('Error updating profile:', res.error);
        return;
      }
      dispatch(setUser(res.user));
      alert('Profile updated successfully');
    } catch (error) {
      console.log('Error updating profile:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          console.log('Login first');
          return;
        }
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        const res = await fetch(`http://localhost:8000/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await res.json();
        setIsUser(userData.userData);
        console.log(userData.userData.UserDetail);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [token]);
  return (
    <>
      {isUser && (
        <Formik
          initialValues={{
            nama_depan: isUser.UserDetail?.nama_depan,
            nama_belakang: isUser.UserDetail?.nama_belakang,
            jenis_kelamin: isUser.UserDetail?.jenis_kelamin,
            tanggal_lahir: '2003-01-01',
            nomor_telepon: isUser.UserDetail?.nomor_telepon,
            photo_profile: isUser.UserDetail?.photo_profile,
          }}
          validationSchema={EditSchema}
          onSubmit={(values, actions) => {
            onEdit(values);
            actions.resetForm();
          }}
        >
          <Form className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <label className="input input-bordered flex items-center gap-2">
                Nama Depan
                <Field
                  name="nama_depan"
                  type="text"
                  className="grow"
                  placeholder={isUser.UserDetail?.nama_depan}
                />
                {/* <ErrorMessage
                    name="nama_depan"
                    component="div"
                    className="text-sm text-red-500"
                  /> */}
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Nama Belakang
                <Field
                  name="nama_belakang"
                  type="text"
                  className="grow"
                  placeholder={isUser.UserDetail?.nama_belakang}
                />
                {/* <ErrorMessage
                    name="nama_belakang"
                    component="div"
                    className="text-sm text-red-500"
                  /> */}
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Jenis Kelamin
                <Field
                  as="select"
                  name="jenis_kelamin"
                  className="grow bg-white"
                >
                  <option value="" label="Pilih jenis kelamin" />
                  <option value="Laki_laki" label="Laki-laki" />
                  <option value="Perempuan" label="Perempuan" />
                </Field>
                {/* <ErrorMessage
                    name="jenis_kelamin"
                    component="div"
                    className="text-sm text-red-500"
                  /> */}
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Tanggal Lahir
                <Field
                  name="tanggal_lahir"
                  type="date"
                  className="grow"
                  placeholder=""
                />
                {/* <Field
                    name="tanggal_lahir"
                    type="text"
                    className="grow"
                    placeholder=""
                  /> */}
                {/* <ErrorMessage
                    name="tanggal_lahir"
                    component="div"
                    className="text-sm text-red-500"
                  /> */}
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Nomor Telepon
                <Field
                  name="nomor_telepon"
                  type="text"
                  className="grow"
                  placeholder={isUser.UserDetail?.nomor_telepon}
                />
                {/* <ErrorMessage
                    name="nomor_telepon"
                    component="div"
                    className="text-sm text-red-500"
                  /> */}
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Photo Profile
                <input
                  type="file"
                  onChange={(e: any) => setFile(e.target.files[0])}
                />
                {/* <ErrorMessage
                    name="nomor_telepon"
                    component="div"
                    className="text-sm text-red-500"
                  /> */}
              </label>

              <div className="card-actions justify-end">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </Form>
        </Formik>
      )}
    </>
  );
}
