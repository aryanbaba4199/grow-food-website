"use client";
import React, { useContext, useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import {
  Card,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
} from "@mui/material";
import { FaEye } from "react-icons/fa";
import { AiFillProject } from "react-icons/ai";
import { MdOutlineProductionQuantityLimits, MdShowChart } from "react-icons/md";
import { Circle } from "rc-progress";
import {
  LineChart,
  Line as LineRechart,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useSpring, animated } from "@react-spring/web";
import Link from "next/link";
import ViewProduct from "@/Component/Admin/products/ViewProduct";
import Loader from "@/Component/helpers/loader";
import UserContext from "@/userContext";
import { adminOrders, getterFunction, vendorApi, vendorProducts } from "@/Api";
import { useSelector } from "react-redux";
import EditProducts from "@/Component/Admin/products/EditProducts";
import OrdersTable from "@/Component/Admin/Dashboard/OrdersTable";
import CreateBrand from "@/Component/Admin/createBrand";
import CreateCategory from "@/Component/Admin/createCategory/createCategory";
import Products from "@/Component/vendors/Products";

// Dummy data for Recharts
const lineChartData = [
  { name: "Jan", orders: 40 },
  { name: "Feb", orders: 30 },
  { name: "Mar", orders: 20 },
  { name: "Apr", orders: 27 },
  { name: "May", orders: 18 },
  { name: "Jun", orders: 23 },
];

const barChartData = [
  { name: "Product A", stock: 400 },
  { name: "Product B", stock: 300 },
  { name: "Product C", stock: 500 },
];

const pieData = [
  { name: "Success", value: 400, color: "#4caf50" },
  { name: "Failed", value: 100, color: "#f44336" },
  { name: "Pending", value: 200, color: "#ffeb3b" },
];

// Animated Number Component
const AnimatedNumber = ({ number }) => {
  const { value } = useSpring({
    from: { value: 0 },
    to: { value: number },
    config: { duration: 4000 },
    reset: true,
    cancel: false,
  });

  return (
    <animated.span>
      {value.to((v) => (v % 1 === 0 ? Math.floor(v) : Math.floor(v * 10) / 10))}
    </animated.span>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 text-sm font-medium ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          } border border-gray-300 rounded-lg`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

// Main Page Component
const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [prodductView, setProductView] = useState(null);
  const [loader, setLoader] = useState(false);
  const [orders, setOrders] = useState([]);
  const [totalOrder, setTotalOrders] = useState(0);
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsData = useSelector((state) => state.products.products.data);

  useEffect(() => {
    if (user && productsData) {
      vendorOrder(user._id);
      // getProducts(user._id, 1);
    }
  }, [user, productsData]);

  const vendorOrder = async (id) => {
    setLoader(true);
    try {
      let res;
      if (user.userType === "admin") {
        res = await getterFunction(`${adminOrders}/id=${id}/pageNum=${1}`);
      } else if (user.userType === "Vendor") {
        res = await getterFunction(`${vendorApi.orders}/${id}`);
      }
      setOrders(res.orders);
      setTotalOrders(res.totalOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoader(false);
    }
  };


 

  const cardData = [
    {
      icon: <MdOutlineProductionQuantityLimits className="text-3xl text-green-600" />,
      name: "Products",
      progress: Math.min((products?.length / 500) * 100, 100),
      volume: products?.length,
    },
    {
      icon: <AiFillProject className="text-3xl text-orange-500" />,
      name: "Stocks",
      progress:10,
      volume: products?.reduce((sum, product) => sum + product?.availableQty, 0),
    },
    {
      icon: <MdShowChart className="text-3xl text-blue-500" />,
      name: "Orders",
      progress: 90,
      volume: 1200,
    },
    {
      icon: <AiFillProject className="text-3xl text-red-500" />,
      name: "Rejected",
      progress: 30,
      volume: 300,
    },
  ];



  return (
    <>
      {loader || !user ? (
        <Loader />
      ) : (
        <>
          <div className="min-h-screen bg-gray-100 p-4">
            {/* Header */}
            <div className="bg-white flex justify-center items-center p-4 rounded-md shadow-md mb-6">
              <Typography variant="h4" className="font-bold text-gray-800">
                Dashboard
              </Typography>
            </div>

            {/* Summary Cards */}
            <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-8">
              {cardData.map((item, index) => (
                <Card key={index} className="p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-center">
                    {item.icon}
                    <div className="relative w-20 h-20">
                      <Circle
                        percent={item.progress}
                        trailColor="#e0e0e0"
                        strokeWidth={8}
                        strokeColor={{
                          "0%": "#4caf50",
                          "99%": "#f44336",
                        }}
                      />
                      <div className="absolute inset-0 flex justify-center items-center">
                        <Typography variant="h6" className="font-semibold">
                          <AnimatedNumber number={item.progress} />%
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <Typography className="mt-4 text-gray-700 font-bold">{item.name}</Typography>
                  <Typography className="text-gray-500">
                    <AnimatedNumber number={item.volume} />
                  </Typography>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-8 mb-6 mt-8">
              <div className="bg-white p-4 rounded-md shadow-md">
                <Typography variant="h6" className="mb-4">
                  Orders Over Time
                </Typography>
                <LineChart width={400} height={300} data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <LineRechart type="monotone" dataKey="orders" stroke="#8884d8" />
                </LineChart>
              </div>
              <div className="bg-white p-4 rounded-md shadow-md">
                <Typography variant="h6" className="mb-4">
                  Stock Levels
                </Typography>
                <BarChart width={400} height={300} data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stock" fill="#82ca9d" />
                </BarChart>
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="bg-white p-4 rounded-md shadow-md mb-6">
              <Typography variant="h6" className="mb-4">
                Order Status Distribution
              </Typography>
              <PieChart width={400} height={300}>
                <Pie
                  data={pieData}
                  cx={200}
                  cy={150}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            {/* Orders Table */}
            {/* <div className="bg-white p-4 rounded-md shadow-md">
              <div className="flex justify-start items-center">
                <Typography variant="h6" className="mb-4">
                  Orders: {totalOrder}
                </Typography>
              </div>
              <OrdersTable orders={orders} />
            </div> */}

          
       

            
            {/* <div>
              <CreateBrand user={user?.userType} />
            </div>
            <div className="mt-8">
              <CreateCategory user={user?.userType} />
            </div> */}
          </div>

         
          
        </>
      )}
    </>
  );
};

export default Dashboard;