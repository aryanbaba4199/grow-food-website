import { getterFunction, updaterFunction, vendorApi } from "@/Api";
import React, { useCallback, useContext, useEffect, useState } from "react";
import UserContext from "@/userContext";
import OrdersTable from "../Admin/Dashboard/OrdersTable";
import Swal from "sweetalert2";

const Order = () => {
  const { user } = useContext(UserContext);
  const [totalOrder, setTotalOrders] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (user) vendorOrder(user._id);
  }, [user]);

  const vendorOrder = async (id) => {
    setLoader(true);
    try {
      const res = await getterFunction(`${vendorApi.orders}/${id}/${1}`);
      setOrders(res.orders);
      setTotalOrders(res.totalOrders);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Error fetching orders:", error);
    }
  };

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      const res = await updaterFunction(vendorApi.updateOrder, {
        orderId,
        status,
      });
      await vendorOrder(user._id);
      Swal.fire({
        title: "Success",
        icon: "success",
        text: "Order status updated successfully",
      });
    } catch (e) {
      console.error("Error in changing status", e);
    }
  });
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-center items-center py-4">
        <span>Orders : {totalOrder}</span>
      </div>
      <div>
        <OrdersTable orders={orders} handleStatusChange={updateOrderStatus} />
      </div>
      <div></div>
    </div>
  );
};

export default Order;
