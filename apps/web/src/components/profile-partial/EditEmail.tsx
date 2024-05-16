'use client';
import React, { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/features/hooks';

import { setUser } from '@/lib/features/user/userSlice';
import Cookies from 'js-cookie';
import { createToken } from '@/app/action';
import { changeEmail } from '@/lib/user';

const EditSchema = yup.object().shape({
  newEmail: yup.string(),
});

export default function EditEmail() {
  //   const token = useAppSelector((state) => state.user.value);
  //   const dispatch = useAppDispatch();

  const onEditEmail = async (data: any) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      const formData = new FormData();
      formData.append('newEmail', data.email);

      const res = await changeEmail(data, token);
      console.log('Response from changeEmail:', res);
      if (res.error) {
        console.error('Error updating email:', res.error);
        return;
      }
      alert('Check your email');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          newEmail: '',
        }}
        validationSchema={EditSchema}
        onSubmit={(values, actions) => {
          onEditEmail(values);
          actions.resetForm();
        }}
      >
        <Form className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <label className="input input-bordered flex items-center gap-2">
              Email
              <Field
                name="newEmail"
                type="email"
                className="grow"
                placeholder="Type New Email"
              />
              {/* <ErrorMessage
                    name="nama_depan"
                    component="div"
                    className="text-sm text-red-500"
                  /> */}
            </label>
            <div className="card-actions justify-end">
              <button type="submit" className="btn btn-primary">
                Change Email
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
