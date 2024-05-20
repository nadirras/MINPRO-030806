import Image from 'next/image';
import './globals.css';
import Carousel from '@/components/home-partial/Carousel';
import Card from '@/components/home-partial/Card';
import Trending from '@/components/home-partial/Trending';
import UpcomingTrendingEvent from '@/components/home-partial/UpcomingTrendingEvent';

export default function Home() {
  return (
    <div>
      <Carousel />
      <Card />
      <Trending />
      {/* <UpcomingTrendingEvent /> */}
    </div>
  );
}
