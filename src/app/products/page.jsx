"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "@/Component/Home/productCard";
import Loader from "@/Component/helpers/loader";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { getBrandsProduct, getCategoriesProduct } from "@/Redux/actions/productActions";
import axios from "axios";
import { getBrandsProductApi, getCategoriesProductApi, productsAPi } from "@/Api";

const Products = () => {
  const [loader, setLoader] = useState(false);
  const [pagination, setPagination] = useState({ hasNextPage: true });
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [isBottomLogged, setIsBottomLogged] = useState(false);
  const [pageType, setPageType] = useState('all');
  const [brandName, setBrandName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [isClient, setIsClient] = useState(false); // Add this state
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Ensure this runs only on the client
  }, []);

  useEffect(() => {
    if (!isClient) return; // Prevent execution on the server

    const query = new URLSearchParams(window.location.search);
    const brands = query.get("brands");
    const categories = query.get("categories");

    if (brands) {
      setBrandName(brands);
      getBrandsProduct(brands);
      return;
    }
    if (categories) {
      setCategoryName(categories);
      getCategoriesProduct(categories);
      return;
    } else {
      console.log("No categories and brand");
      setPagination(productsData.pagination);
      setProducts(productsData.data || []);
    }
  }, [isClient]); // Depend on isClient

  const productsData = useSelector((state) => state.products.products);

  const getBrandsProduct = async (brand) => {
    try {
      setLoader(true);
      setPageType('brands');
      const response = await axios.get(`${getBrandsProductApi}/${brand}/${page}`);
      console.log(response);
      setPagination(response.data.pagination);
      console.log(response.data.data);
      setProducts((prev) => [...prev, ...response.data.data]);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoader(false);
    }
  };

  const getCategoriesProduct = async (category) => {
    try {
      setLoader(true);
      setPageType('categories');
      const response = await axios.get(`${getCategoriesProductApi}/${category}/${page}`);
      setPagination(response.data.pagination);
      setProducts((prev) => [...prev, ...response.data.data]);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoader(false);
    }
  };
  console.log(products);

  const handleScroll = () => {
    if (!isClient) return; // Ensure this runs only on the client
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    if (scrollHeight - (scrollTop + clientHeight) <= 5) {
      if (!isBottomLogged && pagination?.hasNextPage) {
        setIsBottomLogged(true);
        setPage((prev) => prev + 1);
      }
    } else {
      setIsBottomLogged(false);
    }
  };

  useEffect(() => {
    if (!isClient) return; // Ensure this runs only on the client
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isClient, isBottomLogged, pagination?.hasNextPage]);

  useEffect(() => {
    if (page > 1) {
      if (pageType === 'brands') {
        getBrandsProduct(brandName);
      } else if (pageType === 'categories') {
        getCategoriesProduct(categoryName);
      } else {
        handleGetProducts();
      }
    }
  }, [page]);

  const handleGetProducts = async () => {
    try {
      setLoader(true);
      console.log("Fetching products for page:", page);
      const { data } = await axios.get(`${productsAPi}/${page}`);
      setPagination(data.pagination);
      setProducts((prev) => [...prev, ...data.data]);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <Head>
        <title>The Grow Food</title>
        <meta
          name="description"
          content="The Grow Food Is B2B solution for Restaurants"
        />
        <meta name="keywords" content="Restaurants, Hotels, Foods, B2B" />
      </Head>
      <>
        {loader && <Loader />}
        {products.length === 0 ? (
          <>
            {!loader && <p className="text-center my-4">No more products found</p>}
          </>
        ) : (
          <div className="grid mb-8 grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4 px-4">
            {products.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  router.push(`/ProductDetails?product=${item._id}`);
                }}
              >
                <ProductCard item={item} key={index} />
              </div>
            ))}
          </div>
        )}
        {!pagination?.hasNextPage && (
          <p className="text-center my-4">No more products to display</p>
        )}
      </>
    </>
  );
};

export default Products;
