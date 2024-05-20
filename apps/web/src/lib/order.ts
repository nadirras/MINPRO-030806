export const createOrder = async (
  data: any,
  token: string | undefined,
): Promise<any> => {
  console.log(data);

  const res = await fetch(`http://localhost:8000/api/orders`, {
    method: 'POST',
    // body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  console.log('result from order.ts', result);
  return result;
};

export const confirmPayment = async (paymentData: {
  orderId: number;
  amount: number;
  method: string;
}) => {
  const res = await fetch(`http://localhost:8000/api/payments`, {
    method: 'POST',
    // body: JSON.stringify(data),
    //   headers: {
    //     'Content-Type': 'application/json',

    //   },
    //   body: data
  });

  const result = await res.json();
  console.log('result confirmPayment', result);
  return result;
};
