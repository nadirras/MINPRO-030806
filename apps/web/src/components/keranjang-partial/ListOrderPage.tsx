'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { confirmPayment } from '@/lib/order';
import { updateOrderStatus } from '@/lib/order'; // Ensure this function exists to handle order status update

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState([]);
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
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch orders');
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
    // Navigate to the payment page with order details
    router.push(`/payment?orderId=${order.id}&amount=${order.total}`);
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      const res = await updateOrderStatus(orderId, 'Cancel', token);

      if (res.error) {
        console.error('Error cancelling order:', res.error);
        return;
      }

      // Update the local state to remove the cancelled order
      setOrders(orders.filter((order) => order.id !== orderId));
      alert('Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  return (
    <div>
      <h1>Your Orders</h1>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <div>
                <h2>Order #{order.id}</h2>
                <p>Total: {order.total}</p>
                <p>Payment Method: {order.paymentMethod}</p>
                <button onClick={() => handlePayment(order)}>Pay</button>
                <button onClick={() => handleCancelOrder(order.id)}>
                  Cancel
                </button>
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
