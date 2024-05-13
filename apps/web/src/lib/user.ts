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
