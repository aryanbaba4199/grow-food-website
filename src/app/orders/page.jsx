'use client';
import React, { useState, useEffect, useContext, useRef } from "react";
import {
  getOrdersByUser,
  deleteOrderbyId,
} from "@/Api";
import axios from "axios";
import UserContext from "@/userContext";
import Loader from "@/Component/helpers/loader";
import Swal from "sweetalert2";
import { MdDelete, MdDownload } from "react-icons/md";
import Head from "next/head";
import { Typography, Card, CardContent, CardMedia, Button } from "@mui/material";
import Link from "next/link";

const Page = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      fetchOrders(user._id);
    }
  }, [user]);

  const fetchOrders = async (id) => {
    setLoader(true);
    try {
      const res = await axios.get(`${getOrdersByUser}/${id}`);
      if (res.status === 200) {
        setOrders(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoader(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Cancel Order",
      icon: "warning",
      text: "Are you sure you want to cancel this order?",
      showDenyButton: true,
      confirmButtonText: "Yes, Cancel",
      denyButtonText: "No, Keep It",
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteOrder = async () => {
          setLoader(true);
          try {
            const res = await axios.delete(`${deleteOrderbyId}/${id}`);
            if (res.status === 200) {
              Swal.fire("Cancelled", "Order was cancelled successfully.", "success");
              fetchOrders(user._id);
            }
          } catch (error) {
            console.error(error);
            Swal.fire("Error", error.message, "error");
          } finally {
            setLoader(false);
          }
        };
        deleteOrder();
      }
    });
  };

  return (
    <>
      <Head>
        <title>The Grow Food</title>
        <meta name="description" content="The Grow Food Is B2B solution for Restaurants" />
        <meta name="keywords" content="Restaurants, Hotels, Foods, B2B" />
      </Head>

      {loader ? (
        <Loader />
      ) : (
        <div className="container mx-auto p-4">
          <Typography variant="h4" className="text-center mb-6 font-bold text-green-600">
            Your Orders
          </Typography>

          {orders.length === 0 ? (
            <div className="text-center flex flex-col items-center">
              <Typography variant="h6" className="text-gray-700">
                You haven’t made any orders yet.
              </Typography>
              <Link href="/Products">
                <Button variant="contained" color="success" className="mt-4">
                  Explore Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order, index) => (
                <Card key={index} className="shadow-lg">
                  <div className="h-0 translate-x-64 translate-y-12">
                  <img
                    className="h-32  rounded-md shadow-sm shadow-black"
                    src={order.productDetails.image[0] || "/placeholder.jpg"}
                    alt={order.name || "Product Image"}
                  />
                  </div>
                  <CardContent>
                    <Typography className="font-semibold w-[80%] text-green-700 mb-1">
                      {order.productDetails.name || "Product Name"}
                    </Typography>
                    <Typography className="text-gray-700">
                      Category: {order?.productDetails?.categories || "N/A"}
                    </Typography>
                    <Typography className="text-gray-700">
                      Brand : {order?.productDetails?.categories || "N/A"}
                    </Typography>
                    <Typography className="text-gray-700">
                      Price: ₹ {order.productDetails.price?.toFixed(2)}/-
                    </Typography>

                    <Typography className="text-gray-700 mt-2">
                      Quantity: {order.quantity}
                    </Typography>
                    <Typography className="text-gray-700">
                      Order Date: {order.date?.split("T")[0]}
                    </Typography>
                    <Typography className="text-gray-700">
                      Status: {order.status || "Not Processed"}
                    </Typography>
                    <Typography className="text-gray-700 mt-2">
                      Address: {`${order.addressDetails.name} ${order.addressDetails.mobile}`}
                      <Typography className="text-gray-700">
                        {`${order.addressDetails.locality} ${order.addressDetails.city } ${order.addressDetails.state} ${order.addressDetails.zip}` }
                      </Typography>
                    </Typography>
                    <Typography className="text-gray-700 mt-4">
                      Total Amount: ₹ {order.orderAmount?.toFixed(2) || "0.00"}/-
                    </Typography>
                  </CardContent>
                  <div className="flex justify-between p-4">
                    <MdDownload
                      className="text-green-700 text-2xl hover:cursor-pointer"
                      title="Download Invoice"
                    />
                    <MdDelete
                      className="text-red-600 text-2xl hover:cursor-pointer"
                      title="Cancel Order"
                      onClick={() => handleDelete(order._id)}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;