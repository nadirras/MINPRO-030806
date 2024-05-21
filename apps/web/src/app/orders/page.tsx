'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { confirmPayment, updateOrderStatus } from '@/lib/order';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const token = Cookies.get('token');
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!token) {
          console.log('Login first');
          return;
        }
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        const res = await fetch(`http://localhost:8000/api/orders/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include authorization header if required
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch orders: ${errorText}`);
        }

        const data = await res.json();
        const waitingConfirmationOrders = data.orders.filter(
          (order: any) => order.status === 'WaitingConfirmation',
        );
        setOrders(waitingConfirmationOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [token]);

  const handlePayment = async (order: any) => {
    router.push(`/payment?orderId=${order.id}&amount=${order.total}`);
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      const res = await updateOrderStatus(orderId, 'Cancel', token);

      if (res.error) {
        console.error('Error cancelling order:', res.error);
        return;
      }

      setOrders(orders.filter((order) => order.id !== orderId));
      alert('Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>

      {orders.length > 0 ? (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Order #{order.id}</h2>
                <p>Total: {order.total}</p>
                <p>Payment Method: {order.paymentMethod}</p>
                <div className="card-actions justify-end">
                  <button
                    onClick={() => handlePayment(order)}
                    className="btn btn-primary"
                  >
                    Pay
                  </button>
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="btn btn-error"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders waiting for confirmation.</p>
      )}
    </div>
  );
};

export default OrdersPage;
