import React, { useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { Button, Dialog, Typography, useMediaQuery, useTheme } from "@mui/material";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";




const ProductCard = ({ item, index}) => {

 


  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <>
      {item.length == 0 ? (
        <div>
          <h2>No Product Found</h2>
        </div>
      ) : (
        <div key={index} className="md:w-60 w-auto h-56 px-2 flex-1 border bg-gray-100 rounded-md flex flex-col pt-2 justify-center items-center cursor-pointer shadow-sm shadow-black hover:shadow-black hover:shadow-md">
          <div
            
            className="w-full flex-1 justify-center items-center flex flex-col hover:scale-105 hover:ease-in-out hover:transition-all"
          >
            <Carousel
              className="w-full h-auto"
              responsive={responsive}
              ssr={true} // means to render carousel on server-side.
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={3000}
              key={1}
              keyBoardControl={true}
              arrows={false}
              transitionDuration={700}
              dotListClass="custom-dot-list-style"
            >
              {(item.image.length===0 ? ["https://www.nbu.ac.in/img/dept/anthropology/slider/slider3.jpg"] : item.image).map((uri, index) => (
                <div className="flex justify-center" key={index}>
                  <img
           
                    src={uri ? uri : "https://www.nbu.ac.in/img/dept/anthropology/slider/slider3.jpg"}
                    className="w-28 h-24 rounded-md"
                    alt={item.name}
                  />
                </div>
              ))}
            </Carousel>

            <div>
              <Typography className="text-center" variant="subtitle2">{item.name}</Typography>
              <div className="flex justify-center items-center">
              <Typography alignSelf='center' fontWeight={700} fontSize={16}>{item.categories.toUpperCase()}</Typography>
              </div>
            </div>

            <div className="flex gap-2 justify-between place-items-end mt-2 flex-row w-full px-2 text-gray-600 ">
              <span className="flex gap-[1px] text-sm">
                <FaRupeeSign className="mt-[5px] text-sm" />
                <Typography>{item.price}</Typography>
              </span>
              <span>
                <span className="text-green-700 text-xs">{parseInt(item.discount)}% off</span>
              </span>
              <span className="flex bg-color-1 px-2 gap-1 rounded-md">
                <FaRupeeSign className=" mt-[5px] text-sm" />
                <span>{item.sellingPrice ?? 100}</span>
              </span>
            </div>

           
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;