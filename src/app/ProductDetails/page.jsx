"use client";
import React, {Suspense, useEffect, useState } from "react";
import Details from "@/Component/product/Details";
import { Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";

import ProductCard from "@/Component/Home/productCard";

import { useSelector } from "react-redux";
const Page = () => {
  const [product, setProduct] = useState(null);
  const [subProduct, setSubProduct] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("product");

  const productData = useSelector((state) =>
      state.products.products.find((item) => item._id === id)
  );

  const products = useSelector((state) => state.products.products);

  useEffect(() => {
      setProduct(productData);
  }, [productData]);

  useEffect(() => {
      setSubProduct(
          products.filter((item) => item.subCategory === productData?.subCategory)
      );
  }, [products, productData]);

  return (
      <>
          <Head>
              <title>The Grow Food</title>
              <meta
                  name="description"
                  content="The Grow Food Is B2B solution for Restaurants"
              />
              <meta name="keywords" content="Rastaurants, Hotels, Foods, B2B" />
          </Head>
          <div id="container">
              <Details productData={product} />
          </div>
          <div className="mt-8 px-2">
              <Typography className="bg-color-1 text-center">
                  You may also be interested
              </Typography>
              <div className="md:flex grid grid-cols-2 flex-wrap gap-2 justify-between items-center my-4">
                  {subProduct &&
                      subProduct?.map((item, index) => (
                          <>
                              {item.display !== false && (
                                  <div
                                      key={index}
                                      onClick={() => {
                                          setProduct(item);
                                          document
                                              .getElementById("container")
                                              .scrollIntoView({ behavior: "smooth" });
                                      }}
                                  >
                                      <ProductCard item={item} key={index} />
                                  </div>
                              )}
                          </>
                      ))}
              </div>
          </div>
      </>
  );
};

const PageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
      <Page />
  </Suspense>
);

export default PageWrapper;

