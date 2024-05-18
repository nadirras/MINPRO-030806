'use client';
import React, { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/lib/features/hooks';
import { changeRole, updateUser } from '@/lib/user';
import { setUser } from '@/lib/features/user/userSlice';
import Cookies from 'js-cookie';
import { createToken } from '@/app/action';
import { IUser } from './MainProfile';

const EditSchema = yup.object().shape({
  email: yup.string(),
  targetRole: yup.string(),
});

export default function ChangeRole() {
  const [isUser, setIsUser] = useState<IUser | null>(null);
  const dispatch = useAppDispatch();

  const onEdit = async (data: any) => {
    try {
      console.log(data);

      const formData = new FormData();
      formData.set('email', data.email);
      formData.set('targetRole', data.targetRole);
      const token = Cookies.get('token');
      if (!token) {
        console.log('not getting token');
        return;
      }

      console.log(formData);

      const res = await changeRole(data, token);
      if (res.error) {
        console.error('Error updating profile:', res.error);
        return;
      }
      console.log('res from changerole: ', res);
      dispatch(setUser(res.user));
      alert('Check your email');
      console.log('res from change role:', res);
    } catch (error) {
      console.log('Error updating profile:', error);
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        targetRole: '',
      }}
      validationSchema={EditSchema}
      onSubmit={(values, actions) => {
        onEdit(values);
        actions.resetForm();
      }}
    >
      <Form className="card bg-base-100 shadow-xl">
        <div className="card-title mt-3 ml-3">Pilih Role</div>
        <div className="card-body">
          <label className="input input-bordered flex items-center gap-2">
            Email
            <Field name="email" type="text" className="grow" placeholder="" />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            Pilih Role
            <Field as="select" name="targetRole" className="grow bg-white">
              <option value="" label="Pilih role" />
              <option value="Pembeli" label="Pembeli" />
              <option value="EventCreator" label="Event Creator" />
            </Field>
          </label>

          <div className="card-actions justify-end">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </Form>
    </Formik>
  );
}
