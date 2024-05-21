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

export const getOrder = async (token: any) => {
  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Replace with your token decoding logic
    const userId = decodedToken.id; // Adjust based on your token's structure

    const res = await fetch(`http://localhost:8000/api/orders/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
      },
    });
  } else {
    return 'Login first';
  }
};

// export const confirmPayment = async (
//   data: any,
//   token: string | undefined,
// ): Promise<any> => {
//   const res = await fetch(`http://localhost:8000/api/payments`, {
//     method: 'POST',
//     body: JSON.stringify(data),
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     // body: data,
//   });

//   const result = await res.json();
//   console.log('result confirmPayment', result);
//   return result;
// };

export const confirmPayment = async (
  paymentData: { orderId: number; amount: number; method: string },
  token: string,
) => {
  const res = await fetch(`http://localhost:8000/api/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });

  const result = await res.json();
  console.log('result confirmPayment', result);
  return result;
};

export const updateOrderStatus = async (
  orderId: number,
  newStatus: string,
  token: string | undefined,
) => {
  const res = await fetch(
    `http://localhost:8000/api/orders/${orderId}/update-status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newStatus }),
    },
  );

  const result = await res.json();
  console.log('result updateOrderStatus', result);
  return result;
};
