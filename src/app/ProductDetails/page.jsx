'use client'
import React, { useEffect, useState, Suspense } from "react";
import Details from "@/Component/product/Details";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Head from "next/head";
import ProductCard from "@/Component/Home/productCard";
import { useSelector } from "react-redux";

const Page = () => {
  const [product, setProduct] = useState(null);
  const [subProduct, setSubProduct] = useState([]);
  
  const router = useRouter();
  // const searchParams = useSearchParams();
  const id = null;

  const productData = useSelector((state) => state.products.products.find(item => item._id === id));
  const products = useSelector((state) => state.products.products);

  useEffect(() => {
    if (productData) setProduct(productData);
  }, [productData]);

  useEffect(() => {
    if (productData && products) {
      setSubProduct(products.filter(item => item.subCategory === productData.subCategory));
    }
  }, [products, productData]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Head>
        <title>The Grow Food</title>
        <meta name="description" content="The Grow Food Is B2B solution for Restaurants" />
        <meta name="keywords" content="Restaurants, Hotels, Foods, B2B" />
      </Head>
      <div id="container">
        <Details productData={product} />
      </div>
      <div className="mt-8 px-2">
        <Typography className="bg-color-1 text-center">
          You may also be interested
        </Typography>
        <div className="md:flex grid grid-cols-2 flex-wrap gap-2 justify-between items-center my-4">
          {subProduct && subProduct.map((item, index) => (
            item.display !== false && (
              <div
                key={item._id}
                onClick={() => {
                  setProduct(item);
                  document.getElementById("container").scrollIntoView({ behavior: "smooth" });
                }}
              >
                <ProductCard item={item} />
              </div>
            )
          ))}
        </div>
      </div>
    </Suspense>
  );
};

export default Page;
