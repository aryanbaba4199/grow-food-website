"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "@/Component/Home/productCard";
import Loader from "@/Component/helpers/loader";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import {
  getBrandsProduct,
  getCategoriesProduct,
} from "@/Redux/actions/productActions";
import axios from "axios";
import { productsAPi } from "@/Api";

const Products = () => {
  const [loader, setLoader] = useState(false);
  const [pagination, setPagination] = useState({ hasNextPage: true }); // Default hasNextPage to true
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [isBottomLogged, setIsBottomLogged] = useState(false);
  const router = useRouter();
  const { query } = useRouter();

  const brands = query?.brands;
  const categories = query?.categories;
  const dispatch = useDispatch();

  useEffect(() => {
    if (brands) {
      dispatch(getBrandsProduct(brands));
    }
    if (categories) {
      dispatch(getCategoriesProduct(categories));
    }
    setter();
  }, [brands, categories]);

  const brandsProduct = useSelector((state) => state.products.brandsProduct);
  const categoriesProduct = useSelector(
    (state) => state.products.categoryProduct
  );
  const productsData = useSelector((state) => state.products.products);

  const setter = async () => {
    if (brands) {
      setProducts(brandsProduct);
    } else if (categories) {
      setProducts(categoriesProduct);
    } else {
      setPagination(productsData.pagination);
      setProducts(productsData.data || []);
    }
  };

  const handleScroll = () => {
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isBottomLogged, pagination?.hasNextPage]);

  useEffect(() => {
    if (page > 1) {
      handleGetProducts();
    }
  }, [page]);

  const handleGetProducts = async () => {
    try {
      const { data } = await axios.get(`${productsAPi}/${page}`);
      setPagination(data.pagination);
      setProducts((prev) => [...prev, ...data.data]);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching products:", error);
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
        {!products.length ? (
          <Loader />
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
