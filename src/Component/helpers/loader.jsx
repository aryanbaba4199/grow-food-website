import React from "react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Loader = () => {
  return (
    <>
    <div className="flex flex-wrap gap-4 p-4">
      {Array(9)
        .fill("")
        .map((_, index) => (
          <div
            key={index}
            className="flex flex-col justify-center items-center border-2 p-2 rounded-sm"
          >
            <Skeleton
              circle={true}
              height={112} // Matches the image height and width
              width={112}
              className="shadow-md border-1 rounded-full"
            />
            <Skeleton width={80} height={20} className="mt-2" />
            <p className="bg-gray-300 w-28"></p>
          </div>
        ))}
    </div>
    
  </>
  );
};

export default Loader;
