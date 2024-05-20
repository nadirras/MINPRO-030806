import React, { useEffect } from 'react';

export default function Carousel() {
  return (
    <div className="relative w-full h-[30rem] bg-cover bg-center">
      <div className="absolute inset-0 bg-primary bg-opacity-75 rounded-br-[80%] flex items-center justify-start pl-10 transition-all duration-500 ease-in-out">
        <div className="max-w-[35rem]">
          <h1 className="text-6xl font-extrabold text-base-100 mt-10 animate-fadeIn">
            Welcome to EventZenith!
          </h1>
          <p className="text-2xl text-base-100 mt-4 animate-fadeIn delay-150">
            Discover and create amazing events effortlessly.
          </p>
          <button className="btn btn-neutral mt-6 animate-fadeIn delay-300">
            <a href="#events">Get Started</a>
          </button>
        </div>
      </div>
    </div>
  );
}
