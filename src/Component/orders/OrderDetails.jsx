import React, { useEffect, useState } from "react";
import { getOrderApi, getterFunction } from "@/Api";
import {
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { MdLocationOn, MdOutlineShoppingCart } from "react-icons/md";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import Indicator from "./Indicator";
import { IoIosClose } from "react-icons/io";
import InvoicePage from "../helpers/InvoicePage";

const OrderDetails = ({ id, setOpen }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBill, setShowBill] = useState(false);

  useEffect(() => {
    if (id) {
      getOrderDetails();
    }
  }, [id]);

  const getOrderDetails = async () => {
    try {
      const res = await getterFunction(`${getOrderApi}/${id}`);
      setOrder(res[0]); // Assuming `res` is an array with one order object
    } catch (e) {
      console.error("Error in getting", e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "notprocessed":
        return "text-gray-500";
      case "processing":
        return "text-blue-500";
      case "dispatch":
        return "text-yellow-500";
      case "delivered":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h6" color="error">
          No Order Found
        </Typography>
      </div>
    );
  }

  

  return (
    <>
    {showBill ? <InvoicePage bill={order} /> : 
    <div className="p-4 max-w-4xl mx-auto ">
      <Typography
        variant="h5"
        className="font-bold text-gray-800 mb-4 flex justify-between w-full items-center"
      >
        <span>Order Details</span>
        <IoIosClose
          onClick={() => setOpen(null)}
          className="hover:cursor-pointer text-4xl text-gray-500 hover:text-red-500"
        />
      </Typography>

      {/* Order Card */}
      <Card className="shadow-lg px-8">
        <CardContent>
          {/* Order Header */}
          <div className="flex flex-col justify-start items-start">
            <Typography variant="h6" className="text-gray-700">
              Order ID: <span className="font-semibold">{order.orderId}</span>
            </Typography>
            <Typography
              variant="body1"
              className={`font-semibold ${getStatusClass(order.status)}`}
            >
              Status: {order.status.toUpperCase()}
            </Typography>
            <Indicator status={order.status} />
          </div>

          <Divider className="my-4" />

          {/* Address */}
          <div className="mb-4">
            <Typography
              variant="h6"
              className="text-gray-700 flex items-center gap-2"
            >
              <MdLocationOn className="text-blue-500" /> Shipping Address
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              {order.address.name}, {order.address.locality},{" "}
              {order.address.city}, {order.address.state} - {order.address.zip}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Mobile: {order.address.mobile}
            </Typography>
          </div>

          <Divider className="my-4" />

          {/* Products */}
          <div>
            <Typography
              variant="h6"
              className="text-gray-700 flex items-center gap-2"
            >
              <MdOutlineShoppingCart className="text-green-500" /> Products
            </Typography>
            {order.products.map((product, index) => (
              <div key={index} className="mt-2 border-b pb-2 last:border-none">
                <Typography
                  variant="body1"
                  className="font-semibold text-gray-800"
                >
                  {product.name}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Price: ₹{product.price} x {product.quantity} = ₹
                  {product.totalPrice}
                </Typography>
              </div>
            ))}
          </div>

          <Divider className="my-4" />

          {/* Payment and Total */}
          <div className="flex flex-col justify-start items-start">
            <Typography variant="h6" className="text-gray-800">
              Payment Mode:{" "}
              <span className="font-medium">{order.paymentMode}</span>
            </Typography>
            <Typography variant="h6" className="font-bold text-green-600">
              Total: ₹{order.billAmount.toFixed(2)}
            </Typography>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center items-center font-semibold p-8">
        <span onClick={()=>setShowBill(true)} className="bg-gray-950 text-white px-4 py-2 rounded-t-md hover:cursor-pointer hover:bg-gray-800">View Invoice</span>

      </div>
    </div>
}
    </>
  );
};

export default OrderDetails;
