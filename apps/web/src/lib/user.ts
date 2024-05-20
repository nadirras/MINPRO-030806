import axios from 'axios';

export const regUser = async (data: any) => {
  const res = await fetch(`http://localhost:8000/api/users`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();
  return result;
};

export const loginUser = async (data: any) => {
  const res = await fetch(`http://localhost:8000/api/users/login`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();
  return result;
};

export const getUser = async (token: any) => {
  if (token) {
    const res = await fetch(`http://localhost:8000/api/users/keep-login`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();

    return result;
  } else {
    return 'Login First';
  }
};

export const getUserById = async (token: any) => {
  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Replace with your token decoding logic
    const userId = decodedToken.id; // Adjust based on your token's structure

    const res = await fetch(`http://localhost:8000/api/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    return 'Login first';
  }
};

// Adjusting updateUser function to handle types properly
export const updateUser = async (
  data: any,
  token: string | undefined,
): Promise<any> => {
  console.log(data);

  if (!token) {
    return { error: 'Login First' };
  }
  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Replace with your token decoding logic
    const userId = decodedToken.id; // Adjust based on your token's structure

    const res = await fetch(`http://localhost:8000/api/users/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
  } else {
    return 'Login first';
  }
};

// export const updateUser = async (data: any, token: any) => {
//   try {
//     const userId = JSON.parse(atob(token.split('.')[1])).id;
//     const url = `http://localhost:8000/api/users/${userId}`;

//     const config = {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         Authorization: `Bearer ${token}`,
//       },
//     };

//     const formData = new FormData();
//     Object.keys(data).forEach((key) => {
//       formData.append(key, data[key]);
//     });

//     const response = await axios.patch(url, formData, config);
//     return response.data;
//   } catch (error: any) {
//     console.error('Error updating user:', error.response?.data || error);
//     return { error: error.response?.data || error.message };
//   }
// };

export const changeEmail = async (
  data: any,
  token: string | undefined,
): Promise<any> => {
  const res = await fetch(`http://localhost:8000/api/users/change-email`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    // body: data,
  });
  const result = await res.json();
  console.log('for change email user ts:', result);
  return result;
};

export const forgotPassword = async (data: any) => {
  const res = await fetch(`http://localhost:8000/api/users/forgot-password`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();
  return result;
};

export const resetPassword = async (data: any, token: string) => {
  const res = await fetch(
    `http://localhost:8000/api/users/reset-password/${token}`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      // body: data,
    },
  );
  const result = await res.json();
  return result;
};

export const changeRole = async (
  data: any,
  token: string | undefined,
): Promise<any> => {
  console.log(data);

  const res = await fetch(
    `http://localhost:8000/api/users/request-change-role`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      // body: JSON.stringify(data),

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const result = await res.json();
  console.log('result from user.ts', result);
  return result;
};
