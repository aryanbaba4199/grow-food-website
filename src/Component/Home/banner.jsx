'use client'
import React, { useEffect, useState } from "react";
import { Drawer } from "@mui/material";

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("next");

  const images = [
    "https://cdn.dribbble.com/users/11922720/screenshots/19472503/media/6e24b8c30c7c6fa79e058d383b4a16a6.jpg?resize=800x600&vertical=center",
    "https://cdn.dribbble.com/users/3428605/screenshots/15535013/media/c6ff44f2e73164e24306fade80cb05ec.jpg?resize=1200x900&vertical=center",
    "https://cdn.dribbble.com/users/9264027/screenshots/16652831/media/fd77c02b2abb4c5587d0bf04c30bfd5e.png?resize=1200x900&vertical=center",
  ];

  const handlePrev = () => {
    setDirection("prev");
    const index = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(index);
  };

  const handleNext = () => {
    setDirection("next");
    const index = (currentIndex + 1) % images.length;
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="relative w-full" data-carousel="static">
      <div className="relative h-60 overflow-hidden rounded-lg">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out transform ${
              index === currentIndex
                ? "translate-x-0 opacity-100"
                : direction === "next"
                ? "translate-x-full opacity-0"
                : "-translate-x-full opacity-0"
            }`}
            style={{ transitionDuration: '0.7s' }}
          >
            <img
              src={image}
              className="block w-full h-full object-cover"
              alt={`Slide ${index}`}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={handlePrev}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={handleNext}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default Banner;
