'use client'
import React, { useState, useEffect, useContext, useRef } from "react";
import {
  getOrdersByUser,
  getProductbyId,
  updateOrderbyId,
  deleteOrderbyId,
} from "@/Api";
import axios from "axios";
import UserContext from "@/userContext";
import Loader from "@/Component/helpers/loader";
import Swal from "sweetalert2";
import { MdDelete, MdDownload } from "react-icons/md";
import { decryptData } from "@/Context/userFunction";
import Head from "next/head";
import { Typography } from "@mui/material";
import Link from "next/link";
const Page = () => {
  const { user } = useContext(UserContext);
  const [userAddress, setUserAddress] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderIds, setPageIds] = useState([]);
  const [loader, setLoader] = useState(false);

  const ref = useRef(false);

  useEffect(() => {
    if (user && user._id) {
      getPage(user._id);
    }
  }, [user]);

  useEffect(() => {
    setLoader(true);
    ref.current = true;
    if (typeof window !== "undefined" && ref.current) {
      // Retrieve the address string from localStorage
      const addresses = localStorage.getItem("userAddress");

      // Check if the addresses exist and parse them
      let parsedAddresses = [];
      if (addresses) {
        try {
          parsedAddresses = decryptData(addresses);
        } catch (e) {
          console.error("Failed to parse address:", e);
          parsedAddresses = []; // Provide a fallback value
        }
      }

      setUserAddress(parsedAddresses);
    }
    setLoader(false);
    return () => {
      ref.current = false;
    };
  }, []);

  const getPage = async (id) => {
    setLoader(true);
    try {
      const res = await axios.get(`${getOrdersByUser}/${id}`);
      if (res.status === 200) {
        setPageIds(res.data);
        const productIds = res.data.map((item) => item.productId);
        getProductsfromId(productIds);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoader(false);
    }
  };

  const getProductsfromId = async (productIds) => {
    setLoader(true);
    try {
      const productDetails = await Promise.all(
        productIds.map(async (id) => {
          try {
            console.log('getting product by id', id)
            const res = await axios.get(`${getProductbyId}/${id}`);
            return res.data;
          } catch (e) {
            console.error(e);
          }
        })
      );

      setOrders(productDetails || []); // Ensure Page is always an array
    } catch (e) {
      console.error(e);
    } finally {
      setLoader(false);
    }
  };

  console.log('page jave', orders)

  const handleDelete = (id) => {
    Swal.fire({
      title: "Warning",
      icon: "warning",
      text: "Are you sure want to cancel this order",
      showDenyButton: true,
      denyButtonText: "Close",
      confirmButtonColor: "red",
      denyButtonColor: "black",
      confirmButtonText: "Cancel Order",
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteOrder = async () => {
          setLoader(true);
          try {
            const res = await axios.delete(`${deleteOrderbyId}/${id}`);
            if (res.status === 200) {
              Swal.fire({
                title: "Cancelled",
                icon: "success",
                text: "Order Cancelled successfully...",
              });
              getPage(user._id);
            }
          } catch (error) {
            console.error(error);
            Swal.fire({
              title: "Failure",
              icon: "error",
              text: error.message,
            });
          } finally {
            setLoader(false);
          }
        };
        deleteOrder();
      }
    });
  };
  console.log(orderIds)

  return (
    <>
    <Head>
          <title>The Grow Food</title>
          <meta name="description" content="The Grow Food Is B2B solution for Restaurants" />
          <meta name="keywords" content=" Rastaurants, Hotels, Foods, B2B" />
        </Head>
      {loader ? (
        <Loader />
      ) : (
        <>
          <div className="">
            <div className="flex justify-center items-center mt-2">
              <span className="border-color-1 border-2 px-4 py-1 text-xl rounded-md">
                Your Orders
              </span>
            </div>
            {!orderIds && <>
            <div className="flex flex-col justify-center items-center h-screen">
              <Typography>You did not make any orders yet</Typography>
              <Link href='/Products' className="bg-[#15892e] text-white p-2 px-4 rounded-md mt-8">Lets Make a Order</Link>
            </div>
            
            </>}
            {orderIds && orderIds?.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  Swal.fire({
                    title: "Make Changes in this Order",
                    showDenyButton: true,
                    showCancelButton: true,
                    denyButtonText: `Delete`,
                    confirmButtonText: "Update",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleUpdate(item._id);
                    } else if (result.isDenied) {
                      handleDelete(item._id);
                    }
                  });
                }}
                className="flex flex-col gap-2 md:flex-row justify-between py-1 px-2 mt-2 shadow-md shadow-green-600"
              >
                <div className="flex-1 flex justify-evenly items-center">
                  <img
                    src={orders[index]?.image[index]}
                    alt="Grow Food"
                    className="w-24 h-24 rounded-md"
                  />
                  <div className="flex flex-col pl-4">
                    <span className="bg-color-1 px-2 text-green-700 font-semibold rounded-sm w-full">
                      Product Details
                    </span>
                    <span>{orders[index]?.name}</span>
                    <span>{orders[index]?.categories}</span>
                    <span>Price : {orders[index]?.price}/-</span>
                    <span>Discount : {orders[index]?.discount}%</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div>
                    <span className="bg-color-1 px-2 text-green-700 font-semibold rounded-sm w-full">
                      Delivery Address
                    </span>
                  </div>
                  <span>
                    {
                      userAddress.find(
                        (item) => item._id === orderIds[index]?.addressId
                      )?.name
                    }
                  </span>
                  <span>
                    {
                      userAddress.find(
                        (item) => item._id === orderIds[index]?.addressId
                      )?.mobile
                    }
                  </span>
                  <div className="flex gap-2">
                    <span>
                      {
                        userAddress.find(
                          (item) => item._id === orderIds[index]?.addressId
                        )?.landmark
                      }
                    </span>
                    <span>
                      {
                        userAddress.find(
                          (item) => item._id === orderIds[index]?.addressId
                        )?.locality
                      }
                    </span>
                    <span>
                      {
                        userAddress.find(
                          (item) => item._id === orderIds[index]?.addressId
                        )?.city
                      }
                    </span>
                    <span>
                      {
                        userAddress.find(
                          (item) => item._id === orderIds[index]?.addressId
                        )?.state
                      }
                    </span>
                    <span>
                      {" "}
                      -{" "}
                      {
                        userAddress.find(
                          (item) => item._id === orderIds[index]?.addressId
                        )?.zip
                      }
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <div className="">
                    <div>
                      <span className="bg-color-1 px-2 text-green-700 font-semibold rounded-sm w-full">
                        Order Details
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span>Quantity : {item.quantity}</span>
                      <span>Order Date : {item.date && item.date?.split("T")[0]}</span>
                      <span>Amount : {item.orderAmount}/-</span>
                      <span>Status : {item.status ?? "Not Processed"}</span>
                    </div>
                    
                  </div>
                  <div className="pr-4 flex flex-col items-center h-full justify-between py-2">
                      <MdDownload className="bg-color-1 h-8 w-8 rounded-full p-1 hover:cursor-pointer" />
                      <MdDelete className="text-red-600 bg-red-300 h-8 w-8 rounded-full p-1 hover:cursor-pointer"/>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Page;
