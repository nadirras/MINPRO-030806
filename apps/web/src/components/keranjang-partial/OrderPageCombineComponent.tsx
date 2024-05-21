'use client';
import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import { fetchCart, clearCart } from '@/lib/features/cart/cartSlice';
import { createOrder } from '@/lib/order';
import { useAppDispatch, useAppSelector } from '@/lib/features/hooks';
import { RootState } from '@/lib/features/store';
import { useRouter } from 'next/navigation';

const OrderSchema = Yup.object().shape({
  voucherCode: Yup.string(),
  cartItemsToCheckout: Yup.array().required('Cart items are required'),
  paymentMethod: Yup.string().required('Payment method is required'),
});

const OrderPageCombine: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = Cookies.get('token');
  const cart = useAppSelector((state: RootState) => state.cart.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleToPayment = async (values: any, actions: any) => {
    try {
      const cartItemsToCheckout =
        cart.data?.cartItems.map((item: any) => item.cartItemId) || [];

      const res = await createOrder({ ...values, cartItemsToCheckout }, token);

      if (res.error) {
        console.error('Error creating order:', res.error);
      } else {
        console.log('Order created successfully:', res);
        dispatch(clearCart());
        router.push('/orders');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="my-5 min-h-[80rem]">
      <Formik
        initialValues={{
          voucherCode: '',
          cartItemsToCheckout: [],
          paymentMethod: 'virtual account',
        }}
        validationSchema={OrderSchema}
        onSubmit={handleToPayment}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col justify-center items-center gap-3">
            <div className="content-forms">
              <label className="input input-bordered flex items-center gap-2 bg-white">
                Kode Voucher
                <Field
                  name="voucherCode"
                  type="text"
                  className="grow"
                  placeholder=""
                />
              </label>
              <ErrorMessage
                name="voucherCode"
                component="div"
                className="error-message"
              />

              <Field type="hidden" name="cartItemsToCheckout" />

              <label className="input input-bordered flex items-center gap-2 bg-white">
                Metode Pembayaran
                <Field
                  name="paymentMethod"
                  type="text"
                  className="grow "
                  placeholder="virtual account"
                />
              </label>
              <ErrorMessage
                name="paymentMethod"
                component="div"
                className="error-message"
              />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Order'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OrderPageCombine;
