export const createEvent = async (
  data: any,
  token: string | undefined,
): Promise<any> => {
  try {
    const res = await fetch(`http://localhost:8000/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
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
