'use client'
import React, { useState, useEffect } from "react";
import ProductCard from "@/Component/Home/productCard";
import Loader from "@/Component/helpers/loader";
import { decryptData, encryptData } from "@/Context/userFunction";
import { useRouter, useSearchParams} from "next/navigation";
import Head from "next/head";

import { useDispatch, useSelector } from "react-redux";
import { getBrandsProduct, getCategoriesProduct } from "@/Redux/actions/productActions";


const Products = () => {
  
  const [loader, setLoader] = useState(false);
  const [proudcts, setProducts] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const brands = searchParams.get("brands");
  const categories = searchParams.get("categories");
  const dispatch = useDispatch();
  
  useEffect(()=>{
    if(brands){
      dispatch(getBrandsProduct(brands))
      
    }
    if(categories){
      dispatch(getCategoriesProduct(categories))
    }
    setter()
  }, [brands, categories])


  const brandsProduct = useSelector((state)=>state.products.brandsProduct)
  const categoriesProduct = useSelector((state)=>state.products.categoryProduct)
  const productsData = useSelector((state)=>state.products.products)
  const setter = async()=>{
    if(brands){
      
      setProducts(brandsProduct)
    }else if(categories){
  
      setProducts(categoriesProduct)
    }else{
     console.log('hi')
      setProducts(productsData)
     
    }
    
  }


  return (
    <>
      <Head>
        <title>The Grow Food</title>
        <meta
          name="description"
          content="The Grow Food Is B2B solution for Restaurants"
        />
        <meta name="keywords" content=" Rastaurants, Hotels, Foods, B2B" />
      </Head>
      {loader ? (
        <Loader />
      ) : (
        <>
          {!proudcts ? (
            <Loader/>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4 px-4">
              {proudcts.map((item, index) => (
                <>
                  {item.display !== false && (
                    <div
                      key={index}
                      onClick={() => {
                        router.push(
                          `/ProductDetails?product=${item._id}`
                        );
                      }}
                    >
                      <ProductCard item={item} key={index} />
                    </div>
                  )}
                </>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Products;
