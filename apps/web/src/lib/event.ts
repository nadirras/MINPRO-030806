export const createEvent = async (data: any): Promise<any> => {
  console.log('pong');
  try {
    const roleToken = localStorage.getItem('roleToken');
    console.log(roleToken);
    if (!roleToken) {
      throw new Error('Role token not found. Please verify your role first.');
    }

    const res = await fetch(`http://localhost:8000/api/events`, {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${roleToken}`,
      },
      // body: JSON.stringify(data),
      body: data,
    });

    const result = await res.json();
    console.log('result from event.ts:', result);
    return result;
  } catch (error) {
    console.error('Error occurred during fetch:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
};
// lib/event.ts
export const getEvent = async () => {
  try {
    const res = await fetch('http://localhost:8000/api/events', {
      next: { revalidate: 10 },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getEventSlug = async (slug: string) => {
  try {
    const res = await fetch(`http://localhost:8000/api/events/${slug}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const patchEventSlug = async (data: any, slug: string) => {
  try {
    const roleToken = localStorage.getItem('roleToken');
    console.log(roleToken);
    if (!roleToken) {
      throw new Error('Role token not found. Please verify your role first.');
    }
    const res = await fetch(`http://localhost:8000/api/events/${slug}`, {
      method: 'PATCH',
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${roleToken}`,
      },
      body: data,
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export async function getUserEvents(userId: number) {
  const response = await fetch(
    `http://localhost:8000/api/events/users/${userId}`,
  );
  const data = await response.json();
  return data;
}

export async function getDashboard() {
  const response = await fetch(`http://localhost:8000/api/organizers`);
  const data = await response.json();
  return data;
}
