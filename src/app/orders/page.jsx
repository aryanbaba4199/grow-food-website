"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import { getOrdersByUser, deleteOrderbyId } from "@/Api";
import axios from "axios";
import UserContext from "@/userContext";
import Loader from "@/Component/helpers/loader";
import Swal from "sweetalert2";
import { MdDelete, MdDownload } from "react-icons/md";
import Head from "next/head";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Stepper,
  Dialog,
} from "@mui/material";
import Link from "next/link";
import Indicator from "@/Component/orders/Indicator";
import OrderDetails from "@/Component/orders/OrderDetails";

const Page = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loader, setLoader] = useState(true);
  const [detailView, setDetailView] = useState(null);

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
              Swal.fire(
                "Cancelled",
                "Order was cancelled successfully.",
                "success"
              );
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

  const formatOrderDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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

      {loader ? (
        <Loader />
      ) : (
        <div className="container mx-auto p-4">
          <Typography
            variant="h4"
            className="text-center mb-6 font-bold text-green-600"
          >
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
                <Card key={index} className="shadow-lg hover:cursor-pointer">
                  <div onClick={()=>setDetailView(order._id)} className="flex justify-start px-8 items-center">
                    <div className="">
                      <img
                        className="h-32 w-32 rounded-full shadow-sm shadow-black"
                        src={order.images || "logo.png"}
                        alt={order.name || "Product Image"}
                      />
                    </div>
                    <div>
                      <CardContent>
                        <Typography className="text-slate-950 font-semibold">
                          Order Amount: ₹ {order?.billAmount.toFixed(2)}
                        </Typography>

                        <Typography className="text-gray-700 mt-2">
                          Products : {order.productsArray.length}
                        </Typography>
                        <Typography className="text-gray-700">
                          Order Date: {formatOrderDate(order.date)}
                        </Typography>
                        <Typography className="text-gray-700">
                          Status:{" "}
                          <span
                            className={`font-semibold ${
                              order.status === "processing"
                                ? "text-yellow-600"
                                : order.status === "cancel"
                                ? "text-red-600"
                                : "text-[#15892e]"
                            }`}
                          >
                            {order.status || "Not Processed"}
                          </span>
                        </Typography>
                      </CardContent>
                    </div>
                  </div>
                  <div className="flex justify-between px-4 p-1">
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
                  {/* <Indicator status={order.status}/> */}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      <Dialog open={detailView} onClose={()=>setDetailView(null)}>
        <OrderDetails id={detailView} setOpen={setDetailView}/>
      </Dialog>
    </>
  );
};

export default Page;
