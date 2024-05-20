'use client';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/features/cart/cartSlice';
import { getEventSlug } from '@/lib/event';
interface SlugType {
  slug: string;
}
const AddToCartButton: React.FC<SlugType> = ({ slug }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    try {
      const eventData = await getEventSlug(slug);
      const quantity = 1;
      dispatch<any>(addToCart({ eventSlug: slug, quantity }));
      router.push(`/keranjang`); // Navigate to the detail page
      alert('Satu tiket berhasil ditambahkan ke keranjang!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <button onClick={handleAddToCart} className="btn btn-primary">
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
