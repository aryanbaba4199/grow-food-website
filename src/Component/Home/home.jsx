'use client'
import React, { useEffect, useState, useRef } from "react";

import ProductCard from "./productCard";
import { IoIosArrowForward } from "react-icons/io";
import Banner from "./banner";
import Loader from "../helpers/loader";
import Slide from "./sliderMenu";
import { useRouter } from "next/navigation";
import {
  getProducts,
  getBrands,
  getCategories,
  memoize,
} from "@/Context/productFunction";
import {
  decryptData,
  encryptData,
  fetchUserDetails,
} from "@/Context/userFunction";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";

const Home = () => {
  const [filteredBrand, setFilteredBrand] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  

  const router = useRouter();
  const productContainerRef = useRef(null);

  const products =useSelector((state)=>state.products.products);
  const brands = useSelector((state)=>state.products.brands);
  const categories = useSelector((state)=>state.products.categories);


  

    

    

  const handleBrandFilter = (brand) => {
    const brandView = products.filter((product) => product.brand === brand);
    setFilteredBrand(brandView);
    setIsFilter(true);
    productContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategoryFilter = (brand) => {
    const brandView = products.filter(
      (product) => product.categories === brand
    );
    setFilteredBrand(brandView);
    setIsFilter(true);
    productContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <>


      {!products && products.length === null && products.length === 0 ? (
        <Loader />
      ) : (
        <div className=" px-4 w-full md:mt-0 mt-14">
          <div className="flex justify-center items-center mt-4">
            <Banner />
          </div>
          <div className=" mt-4">
            <Slide
              products={brands}
              title="Shop By Brand"
              timer={24}
              filter={handleBrandFilter}
            />
          </div>
          <div className=" mt-8">
            <Slide
              products={categories}
              title="Shop By Categories"
              timer={24}
              filter={handleCategoryFilter}
            />
          </div>
          <div className="drop-shadow-2xl  shadow-black">
            <div className="flex mt-8 justify-between txt-1 ">
              <span className="font-bold text-lg px-8 py-1">
                Special Products
              </span>
              <span
                onClick={() =>
                  router.push({
                    pathname: "/products",
                    query: {
                      selectedProducts: JSON.stringify(products),
                    },
                  })
                }
                className=" px-6 hover:cursor-pointer"
              >
                <IoIosArrowForward className="w-6 h-6 p-1 bg-color-1 rounded-full mt-1" />
              </span>
            </div>
            <div
              id="product-container"
              ref={productContainerRef} // Attach the ref to the product container div
              className="md:flex mb-8 flex-row flex-wrap grid grid-cols-2 gap-4 mt-4"
            >
              {!isFilter ? (
                <>
                  {products.map((item, index) => (
                    <>
                      {item.display !== false && (
                        <div
                          className="flex-1"
                          key={index}
                          onClick={() => {
                      
                            router.push(
                              `/ProductDetails?product=${item._id}`
                            );
                          }}
                        >
                          <ProductCard
                            key={index}
                            item={item}
                            isCart={false}
                            deleteCartItem={false}
                          />
                        </div>
                      )}
                    </>
                  ))}
                </>
              ) : (
                <>
                  {filteredBrand.map((item, index) => (
                    <ProductCard
                      key={index}
                      item={item}
                      isCart={false}
                      deleteCartItem={false}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;