'use client';
import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import Link from 'next/link';
import { regUser } from '@/lib/user';

const RegisterSchema = yup.object().shape({
  username: yup.string().required('name required'),
  email: yup.string().email('invalid email').required('email required'),
  password: yup
    .string()
    .min(6, 'password must be at least 6 characters')
    .required('password required'),
});
export default function Register() {
  const onRegister = async (data: any) => {
    try {
      await regUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values, action) => {
          console.log(values);
          onRegister(values);
          action.resetForm();
        }}
      >
        {() => {
          return (
            <Form className="h-screen flex justify-center items-center">
              <div className="card w-[35rem] bg-base-100 shadow-xl">
                <h2 className="text-3xl font-bold p-9">Register</h2>

                <div className="card-body">
                  <label className="input input-bordered flex items-center gap-2">
                    Name
                    <Field
                      name="username"
                      type="text"
                      className="grow"
                      placeholder="Daisy"
                    />
                    <ErrorMessage
                      name="username"
                      component={'div'}
                      className="text-sm text-red-500"
                    />
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    Email
                    <Field
                      name="email"
                      type="text"
                      className="grow"
                      placeholder="cetewindt@mail.com"
                    />
                    <ErrorMessage
                      name="email"
                      component={'div'}
                      className="text-sm text-red-500"
                    />
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    Password
                    <Field
                      name="password"
                      type="password"
                      className="grow"
                      placeholder="******"
                    />
                    <ErrorMessage
                      name="password"
                      component={'div'}
                      className="text-sm text-red-500"
                    />
                  </label>

                  <p>
                    Already have account?{' '}
                    <span>
                      <Link href="/login">Login</Link>
                    </span>
                  </p>
                  <div className="card-actions justify-end">
                    <button type="submit" className="btn btn-primary">
                      Register
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
