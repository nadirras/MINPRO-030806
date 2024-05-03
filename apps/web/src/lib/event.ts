const base_url = process.env.NEXT_PUBLIC_BASE_API_URL;

export const getEvents = async () => {
  const res = await fetch(`${base_url}/events`, { next: { revalidate: 10 } });
  const data = await res.json();

  return data;
};

export const getEventSlug = async (slug: string) => {
  const res = await fetch(`${base_url}/events`, { next: { revalidate: 10 } });
  const data = await res.json();

  return data;
};
