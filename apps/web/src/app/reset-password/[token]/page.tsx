'use client';
import { resetPassword } from '@/lib/user';
import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';

const EditSchema = yup.object().shape({
  email: yup.string(),
  newPassword: yup.string(),
});

export default function ResetPassword({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const onEditPassword = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('newPassword', data.newPassword);

      const res = await resetPassword(data, params.token);
      console.log('Response from forgotPassword:', res);
      if (res.error) {
        console.error('Error sending email:', res.error);
        return;
      }
      alert('update password successful');
      router.push('/login');
    } catch (error) {
      console.log(error);
    }
  };
  console.log(params.token);

  return (
    <div className="h-screen">
      <div className="flex items-center justify-center mt-10">
        <Formik
          initialValues={{
            email: '',
            newPassword: '',
          }}
          validationSchema={EditSchema}
          onSubmit={(values, actions) => {
            onEditPassword(values);
            actions.resetForm();
          }}
        >
          <Form className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <label className="input input-bordered flex items-center gap-2">
                Email
                <Field
                  name="email"
                  type="email"
                  className="grow"
                  placeholder="Type Email"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Password
                <Field
                  name="newPassword"
                  type="password"
                  className="grow"
                  placeholder="Type New Password"
                />
              </label>
              <div className="card-actions justify-end">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
