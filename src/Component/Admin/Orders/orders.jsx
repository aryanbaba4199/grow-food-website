import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "@/Redux/actions/orderAction";
import OrderCard from "./orderCard";
import { Typography } from "@mui/material";

const Orders = ({user}) => {
  const [ordersData, setOrdersData] = useState([]);
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const { adminOrders } = useSelector((state) => state.orders);

   

  return (
    <div className="container mx-auto px-4 py-8">
      <Typography
        variant="h4"
        className="mb-4 flex justify-center items-center "
      >
        <span className="bg-[#1e4426] rounded-s-md px-4 text-white">
          Orders
        </span>
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminOrders?.map((order) => (
          <OrderCard key={order._id} order={order} user={user}  />
        ))}
      </div>
    </div>
  );
};

export default Orders;
