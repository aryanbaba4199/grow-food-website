"use client";

import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Button, Dialog, Typography, IconButton, Card } from "@mui/material";
import Checkout from "@/Component/Checkout/checkout";
import { encryptData } from "@/Context/userFunction";
import Head from "next/head";
import { useSelector } from "react-redux";
import UserContext from "@/userContext";
import { cartApi, deleteCartItem, getProductbyId } from "@/Api";
import { FaMinus, FaPlus } from "react-icons/fa";
import Loader from "@/Component/helpers/loader";
import { Add, Remove } from "@mui/icons-material";

const Page = () => {
  const [PageData, setPageData] = useState([]);
  const [userPageIds, setUserPageIds] = useState([]);
  const [userId, setUserId] = useState("");
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState([]); // Define the state for qty
  const [totalCost, setTotalCost] = useState(0); // To hold the total cost
  const ref = useRef(false);
  const router = useRouter();

  const { user } = useContext(UserContext);

  useEffect(() => {
    ref.current = true;
    if (typeof window !== "undefined" && ref.current && user) {
      setUserId(user?._id);
      getPageData(user._id);
    }
    return () => {
      ref.current = false;
    };
  }, [user]);

  const getPageData = async (id) => {
    setLoader(true);
    try {
      const res = await axios.get(`${cartApi}/${id}`);
      if (res.status === 200) {
        const groupedProducts = res.data.reduce((acc, item) => {
          if (!acc[item.productId]) {
            acc[item.productId] = { ...item, qty: item.qty };
          } else {
            acc[item.productId].qty += item.qty;
          }
          return acc;
        }, {});

        const productIds = Object.keys(groupedProducts);
        setUserPageIds(Object.values(groupedProducts));
        setQty(Object.values(groupedProducts).map((item) => item.qty));
        getProductsfromId(productIds);
      }
      setLoader(false);
    } catch (e) {
      setLoader(false);
      console.error(e);
    }
  };

  const products = useSelector((state) => state.products.products);

  useEffect(() => {
    if (products.length > 0 && userPageIds.length > 0) {
      const matchedProducts = products.filter((item) =>
        userPageIds.map((id) => id.productId).includes(item._id)
      );
      setPageData(matchedProducts);
    }
  }, [products, userPageIds]);

  const getProductsfromId = async (productIds) => {
    try {
      const productDetails = await Promise.all(
        productIds.map(async (id) => {
          const res = await axios.get(`${getProductbyId}/${id}`);
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
      const res = await axios.delete(`${deleteCartItem}/${id}`);
      if (res.status === 200) {
        Swal.fire({
          title: "Deleted",
          icon: "success",
          text: res.data.message,
        });
        getPageData(user._id);
      }
    } catch (e) {
      setLoader(false);
      console.error(e);
    }
  };

  const handleQtyChange = (productId, increment) => {
    const updatedQty = qty.map((quantity, index) =>
      userPageIds[index].productId === productId
        ? increment
          ? quantity + 1
          : quantity - 1
        : quantity
    );
    setQty(updatedQty);
    updateProductQty(productId, increment);
  };

  const updateProductQty = async (productId, increment) => {
    const updatedData = userPageIds.find(
      (item) => item.productId === productId
    );
    updatedData.qty = increment ? updatedData.qty + 1 : updatedData.qty - 1;

    try {
      await axios.put(`${cartApi}/update/${productId}`, updatedData); // Assuming you have an endpoint to update qty
      getPageData(user._id); // Refresh the cart data after updating qty
    } catch (e) {
      console.error(e);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    PageData.forEach((item, index) => {
      total += parseInt(item.sellingPrice * qty[index]);
    });
    total += 30; // Adding the delivery charge
    setTotalCost(total);
  };

  const handleCheckoutAll = () => {
    if(totalCost<2000){
      Swal.fire({
        title: "Warning",
        icon: "warning",
        text: "Total cost is less than 2000. add more other wise delivery charges will affect",
        confirmButtonText: "Proceed",
      })
      return;
    }
    if (PageData.length > 0) {
      localStorage.removeItem('route');
            localStorage.removeItem('products');
            localStorage.removeItem('qty');
      localStorage.setItem("products", JSON.stringify(PageData));
      localStorage.setItem("qty", JSON.stringify(qty));
      localStorage.setItem("route", "cart");
      router.push('/checkout')
    } else {
      Swal.fire({
        title: "No Items",
        icon: "info",
        text: "Your Page is empty.",
      });
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [qty, PageData]);

  return (
    <>
      <Head>
        <title>The Grow Food</title>
        <meta
          name="description"
          content="The Grow Food Is B2B solution for Restaurants"
        />
        <meta name="keywords" content=" Restaurants, Hotels, Foods, B2B" />
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
          <div className="md:flex grid grid-cols-2 md:mt-2 mt-14 flex-col gap-4 flex-wrap justify-between w-fit px-4">
            {PageData.map((item, index) => (
              <Card key={item._id} className="flex flex-row gap-8 p-2">
                <div>
                  <img src={item.image[0]} className="w-52 h-32 rounded-md" />
                </div>
                <div className="w-full">
                  <Typography>{item.name}</Typography>
                  <Typography>Price: ₹ {item.sellingPrice}</Typography>
                  <Typography>Brand: {item.brand.toUpperCase()}</Typography>
                  <Typography className="font-semibold">
                    Total: ₹ {(item.sellingPrice * qty[index]).toFixed(2)}
                  </Typography>
                </div>

                <div className="flex flex-col justify-between items-end mt-1">
                  <div className="flex justify-center items-center">
                    <div className="flex justify-center items-center px-4 border-[2px] border-gray-200 rounded-md gap-8 p-1">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleQtyChange(item._id, false)}
                      >
                        <Remove />
                      </IconButton>
                      <Typography>{qty[index]}</Typography>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleQtyChange(item._id, true)}
                      >
                        <Add />
                      </IconButton>
                    </div>
                  </div>
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
              </Card>
            ))}
          </div>
          {userId !== "" && PageData.length > 0 && (
            <div className="flex justify-center items-center mt-4 px-4 flex-col mb-8">
              <div className="justify-end flex flex-col items-end gap-2 mb-4">
                <span className="font-semibold text-gray-700">Subtotal : ₹ {totalCost-30}</span>
                <span className="text-gray-700 font-semibold">Delivery Charge: Free</span>
                <span className="font-bold text-slate-950 text-lg">Total: ₹ {totalCost}</span>
              </div>
              <div className="flex justify-end items-end">
              <Button
                variant="outlined"
                onClick={handleCheckoutAll}
                className={`text-[#15892e] ${totalCost<2000 && "bg-red-600 text-white"}   border-green-700 px-4 py-2 rounded-md font-semibold`}
              >
                Checkout
              </Button>
              </div>
            </div>
          )}
        </div>
      )}
     
    </>
  );
};

export default Page;
