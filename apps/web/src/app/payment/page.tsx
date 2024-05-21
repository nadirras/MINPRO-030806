'use client';
import { confirmPayment } from '@/lib/order';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';

const EditSchema = yup.object().shape({
  amount: yup.number().required('Amount is required'),
  method: yup.string().required('Payment method is required'),
});

export default function PaymentPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const token = Cookies.get('token');

  useEffect(() => {
    // Parse query parameters from URL
    const searchParams = new URLSearchParams(window.location.search);
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (orderId) setOrderId(orderId);
    if (amount) setAmount(amount);
  }, []);

  const onEdit = async (data: any) => {
    try {
      if (!token) {
        console.error('No token found');
        return;
      }

      const paymentData = {
        orderId: Number(orderId),
        amount: Number(amount),
        method: data.method,
      };

      const res = await confirmPayment(paymentData, token);
      if (res.error) {
        console.error('Error confirming payment:', res.error);
        return;
      }

      alert('Payment confirmed successfully');
      console.log('res:', res);
      router.push('/orders'); // Redirect to orders page after payment
    } catch (error) {
      console.log('Error confirming payment:', error);
    }
  };

  if (orderId === null || amount === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-primary">Payment</h1>
      <Formik
        initialValues={{
          amount: amount || '',
          method: 'virtual account',
        }}
        validationSchema={EditSchema}
        onSubmit={(values, actions) => {
          onEdit(values);
          actions.setSubmitting(false);
        }}
      >
        <Form className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="input input-bordered flex items-center gap-2">
              <label htmlFor="amount">Amount</label>
              <Field
                name="amount"
                type="text"
                className="grow"
                value={amount}
                readOnly
              />
            </div>
            <ErrorMessage
              name="amount"
              component="div"
              className="error-message"
            />

            <div className="input input-bordered flex items-center gap-2">
              <label htmlFor="method">Payment Method</label>
              <Field
                name="method"
                type="text"
                className="grow"
                placeholder="virtual account"
              />
            </div>
            <ErrorMessage
              name="method"
              component="div"
              className="error-message"
            />

            <div className="card-actions justify-end">
              <button type="submit" className="btn btn-primary">
                Confirm Payment
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
