import React from "react";

import { IoIosCloseCircle } from "react-icons/io";
import { MdError } from "react-icons/md";
import { IoIosCloudDone } from "react-icons/io";
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';

const Notifier = ({ open, setOpen, message }) => {

  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <>
    <div
    data-aos="fade-in" 
    data-aos-duration="600" 
    data-aos-easing="ease-in-out" 
    className="bg-gray-100">
      <div className=" flex justify-center items-center text-7xl mt-4">
        {open === "200" ? (
          <IoIosCloudDone className="text-green-600 " />
        ) : (
          <MdError className="text-red-600" />
        )}
      </div>
      <div
        style={{ fontFamily: "sans-serif" }}
        className="  w-[25rem] rounded-lg flex items-center text-gray-950 justify-center bg-gray-100"
      >
        <div className=" p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex justify-center items-center">
            <h2 className="text-xl font-semibold mb-4 text-center ">
              {open === "200" ? (
                <p className="bg-green-600 text-white rounded-lg w-36 my-1">
                  Success
                </p>
              ) : (
                <p className="bg-red-600 text-white rounded-lg w-36 my-1">
                  Failure
                </p>
              )}
            </h2>
          </div>
          <div className="flex justify-center items-center flex-wrap">
            <span className="text-center break-words max-w-full ">
              {open === "200" ? (
                <span className="text-gray-950 font-medium">
                  {message}
                </span>
              ) : (
                <p className="text-red-600 break-words max-w-full">{open}</p>
              )}
            </span>
          </div>
          <div className="flex justify-center items-center">
            <button
              className=" rounded-md text-white mt-8 py-2 "
              onClick={() => setOpen("")}
            >
              {open === "200" ? (
                <span className="bg-green-600 py-2 active:bg-purple-600 shadow-md shadow-black rounded-md w-full px-8">
                  Ok
                </span>
              ) : (
                <span className="bg-red-600  shadow-md shadow-black py-2 rounded-md w-full px-12 active:bg-purple-600">
                  Ok
                </span>
              )}
              
            </button>
          </div>
          <br />
        </div>
      </div>
      </div>
    </>
  );
};

export default Notifier;
