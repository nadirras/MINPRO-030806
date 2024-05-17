'use client';
import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { forgotPassword } from '@/lib/user';

const EditSchema = yup.object().shape({
  email: yup.string(),
});

export default function ForgotPassword() {
  const onEditEmail = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);

      const res = await forgotPassword(data);
      console.log('Response from forgotPassword:', res);
      if (res.error) {
        console.error('Error sending email:', res.error);
        return;
      }
      alert('Check your email');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen">
      <div className="flex items-center justify-center mt-10">
        <Formik
          initialValues={{
            email: '',
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
                  name="email"
                  type="email"
                  className="grow"
                  placeholder="Type Email"
                />
                {/* <ErrorMessage
                    name="nama_depan"
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
      </div>
    </div>
  );
}
