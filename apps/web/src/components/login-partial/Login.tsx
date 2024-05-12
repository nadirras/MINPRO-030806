'use client';
import Link from 'next/link';
import React from 'react';
import { loginUser } from '@/lib/user';
import { useAppDispatch } from '@/lib/features/hooks';
import { setUser } from '@/lib/features/user/userSlice';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import * as yup from 'yup';
import { createToken } from '@/app/action';

const LoginSchema = yup.object().shape({
  email: yup.string().email('invalid email').required('email required'),
  password: yup
    .string()
    .min(6, 'password must be at least 6 characters')
    .required('password required'),
});

export default function Login() {
  const search = useSearchParams();
  const redirect = search.get('redirect') || '/';
  const dispatch = useAppDispatch();

  const onLogin = async (data: any) => {
    try {
      const res = await loginUser(data);
      dispatch(setUser(res.user));
      createToken(res.token, redirect);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={LoginSchema}
      onSubmit={(values, action) => {
        console.log(values);
        onLogin(values);
        action.resetForm();
      }}
    >
      <Form className="h-screen flex justify-center items-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <h1 className="text-3xl font-bold p-9">Login</h1>
          <div className="card-body">
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
                placeholder="*****"
              />
              <ErrorMessage
                name="password"
                component={'div'}
                className="text-sm text-red-500"
              />
            </label>
            <p>Forgot password?</p>
            <p>
              Didn't have account?{' '}
              <span className="text-primary">
                <Link href="/register">Register</Link>
              </span>
            </p>
            <div className="card-actions justify-end">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </div>
        </div>
      </Form>
    </Formik>
  );
}
