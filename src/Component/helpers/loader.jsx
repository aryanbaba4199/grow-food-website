import React from "react";
import { Dialog } from "@mui/material";

const Loader = () => {
  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          backgroundColor: 'inherit',
          boxShadow: 'none',
        },
      }}
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent black
        },
      }}
    >
      <div className=" mb-16 text-center bg-transparent flex flex-col justify-center items-center overflow-hidden">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#1e4426] mx-auto"></div>
        {/* <h2 className="text-black px-4 mt-4 font-mono ml-8 text-md">Loading...</h2> */}
      </div>
    </Dialog>
  );
};

export default Loader;
