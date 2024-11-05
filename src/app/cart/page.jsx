"use client";
import React, { useEffect, useState, useRef, useContext } from "react";
import { getPagebyUser, getProductbyId, deletePageItem, cartApi, deleteCartItem } from "@/Api";
import axios from "axios";
import ProductCard from "@/Component/Home/productCard";
import Swal from "sweetalert2";
import Loader from "@/Component/helpers/loader";

import { useRouter } from "next/navigation";
import { Button, Dialog, Typography } from "@mui/material";
import Checkout from "@/Component/checkout/checkout";
import { decryptData, encryptData } from "@/Context/userFunction";
import Head from "next/head";
import { useSelector } from "react-redux";
import UserContext from "@/userContext";

const Page = () => {
  const [PageData, setPageData] = useState([]);
  const [userPageIds, setUserPageIds] = useState([]);
  const [userId, setUserId] = useState("");
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState([]);
  const ref = useRef(false);
  const router = useRouter();

  const {user} = useContext(UserContext);

  

  useEffect(() => {
    ref.current = true;
    if (typeof window !== "undefined" && ref.current && user) {
        setUserId(user && user._id);
        getPageData(user._id);
    }
    return () => {
      ref.current = false;
    };
  }, [user]);

  

  const getPageData = async (id) => {
    console.log('Getting cart data', id);
    setLoader(true);
    try {
      const res = await axios.get(`${cartApi}?id=${id}`);
      if (res.status === 200) {
        const groupedProducts = res.data.data.reduce((acc, item) => {
          if (!acc[item.productId]) {
            acc[item.productId] = { ...item, qty: item.qty };
          } else {
            acc[item.productId].qty += item.qty;
          }
          setLoader(false);
          return acc;
        }, {});

        const productIds = Object.keys(groupedProducts);
        setUserPageIds(Object.values(groupedProducts));
        getProductsfromId(productIds);
      }
    } catch (e) {
      setLoader(false);
      console.error(e);
    }
  };

  const products = useSelector((state) => state.products.products);

  useEffect(() => {
    if (products) {
      const x = products.filter((item) =>
        userPageIds.map((id) => id.productId).includes(item._id)
      );
      setPageData(x);

      for (let i = 0; i < x.length; i++) {
        qty.push(userPageIds[i].qty);
      }
    }
  }, []);

  const getProductsfromId = async (productIds) => {
    try {
      const productDetails = await Promise.all(
        productIds.map(async (id) => {
          const res = await axios.get(`${getProductbyId}${id}`);
          return res.data;
        })
      );
      setPageData(productDetails);
      setLoader(false);
    } catch (e) {
      console.error(e);
      setLoader(false);
    }
  };

  const deletePage = async (id) => {
    setLoader(true);
    try {
      const res = await axios.delete(`${deleteCartItem}${id}`);
      if (res.status === 200) {
        Swal.fire({
          title: "Deleted",
          icon: "success",
          text: res.data.message,
        });
        getPageData(user._id);
        userPageIds.splice(userPageIds.indexOf(id)._id, 1);
        setLoader(false);
      }
    } catch (e) {
      // Swal.fire({
      //   title: "Failed",
      //   icon: "error",
      //   text: e.message,
      // });
      setLoader(false);
      console.error(e);
    }
  };

  const handleCheckoutAll = () => {
    if (PageData.length > 0) {
      setOpen(true);
    } else {
      Swal.fire({
        title: "No Items",
        icon: "info",
        text: "Your Page is empty.",
      });
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
        <meta name="keywords" content=" Rastaurants, Hotels, Foods, B2B" />
      </Head>
      {loader ? (
        <Loader />
      ) : (
        <div>
          {userId === "" && (
            <div className="w-[100vw] h-[100vh] flex justify-center items-center text-2xl font-semibold">
              <p>Log in to see your Page details</p>
            </div>
          )}
          {userId !== "" && PageData.length === 0 && (
            <div className="w-[100vw] h-[100vh] flex justify-center items-center text-2xl font-semibold">
              <p>No Cart Item Found</p>
            </div>
          )}
          <div className="md:flex grid grid-cols-2 md:mt-2 mt-14 flex-row gap-4 flex-wrap justify-between w-fit  px-4">
            {PageData.map((item, index) => (
              <>
                <div>
                  <div
                    onClick={() => {
                      const id = encryptData(item._id);

                      router.push(
                        `/ProductDetails?thegrowfood=${encodeURIComponent(id)}`
                      );
                    }}
                  >
                    <ProductCard
                      item={item}
                      key={index}
                      qty={
                        userPageIds.find((Page) => Page.productId === item._id)
                          ?.qty
                      }
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="txt-1">
                      Quantity : {userPageIds[index]?.qty}
                    </span>
                    <Button
                      variant="contained"
                      color="warning"
                      
                      style={{
                        padding: 2,
                        paddingLeft: 5,
                        paddingRight: 5,
                        margin: 0,
                      }}
                      onClick={() => deletePage(userPageIds[index]?._id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </>
            ))}
          </div>
          {userId !== "" && PageData.length > 0 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleCheckoutAll}
                className="bg-color-1 text-white px-4 py-2 rounded-md font-semibold"
              >
                Checkout All
              </button>
            </div>
          )}
        </div>
      )}
      <Dialog open={open} fullScreen>
        <Checkout products={PageData} setCopen={setOpen} qty={qty} />
      </Dialog>
    </>
  );
};

export default Page;
