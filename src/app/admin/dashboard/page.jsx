"use client";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import {
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
} from "@mui/material";
import { FaEye } from "react-icons/fa";
import { AiFillProject } from "react-icons/ai";
import { MdOutlineProductionQuantityLimits, MdShowChart } from "react-icons/md";
import { Line, Circle } from "rc-progress";
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
import { adminOrders, getterFunction, vendorApi, } from "@/Api";
import { useSelector } from "react-redux";
import EditProducts from "@/Component/Admin/products/EditProducts";
import OrdersTable from "@/Component/Admin/Dashboard/OrdersTable";
import CreateBrand from "@/Component/Admin/createBrand";
import CreateCategory from "@/Component/Admin/createCategory/createCategory";

// Dummy data for Recharts
const lineChartData = [
  {
    name: "Jan",
    orders: 40,
  },
  {
    name: "Feb",
    orders: 30,
  },
  {
    name: "Mar",
    orders: 20,
  },
  {
    name: "Apr",
    orders: 27,
  },
  {
    name: "May",
    orders: 18,
  },
  {
    name: "Jun",
    orders: 23,
  },
];

const barChartData = [
  {
    name: "Product A",
    stock: 400,
  },
  {
    name: "Product B",
    stock: 300,
  },
  {
    name: "Product C",
    stock: 500,
  },
];

const pieData = [
  { name: "Success", value: 400, color: "#4caf50" },
  { name: "Failed", value: 100, color: "#f44336" },
  { name: "Pending", value: 200, color: "#ffeb3b" },
];

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
      {value.to((v) => {
        if (v % 1 === 0) {
          return Math.floor(v);
        } else {
          return Math.floor(v * 10) / 10;
        }
      })}
    </animated.span>
  );
};

const Page = () => {
  const { user } = useContext(UserContext);
  const [prodductView, setProductView] = useState(null);
  const [loader, setLoader] = useState(false);

  
  const [orders, setOrders] = useState([]);
  const [totalOrder, setTotalOrders] = useState(null);
  const [products, setProducts] = useState([]);
  
  const [editProduct, setEditProduct] = useState(null);
  const x = useSelector((state) => state.products.products.data)




  useEffect(() => {
    if (user && x) {
      vendorOrder(user._id);
      getProducts(user._id);
    }
  }, [user, x]);
  const vendorOrder = async (id) => {
   console.log('hi')
    try {
      if(user.userType==='admin'){
        const res = await getterFunction(`${adminOrders}/id=${id}/pageNum=${1}`);
        console.log('admin');
       setOrders(res.orders);
       setTotalOrders(res.totalOrders);
      }else if(user.userType==='Vendor'){
        console.log('vendor');
        console.log(`vendorOrdersApi.orders}/${id}`)
      const res = await getterFunction(`${vendorApi.orders}/${id}`);
      console.log('vendor', res);
      setTotalOrders(res.totalOrders);  
      setOrders(res);
      }
    } catch (error) {
      setOrders([]);
      console.error('Error in getting admin orders')
    }
  };
  const getProducts = async(id)=>{

    if(user.userType==='Vendor'){

      const y = await x.filter(
        (item) => item.vendorId === id
      );

      setProducts(y);
    }else if(user.userType==='admin'){

      setProducts(x);
    }
  }

  console.log(products)

  const cardData = products && [
    {
      icon: (
        <MdOutlineProductionQuantityLimits className="text-3xl text-green-600" />
      ),
      name: "Products",
      progress: Math.min((products?.length / 500) * 100, 100),
      volume: products?.length,
    },
    {
      icon: <AiFillProject className="text-3xl text-orange-500" />,
      name: "Stocks",
      progress: Math.min(
        (products?.reduce((sum, product) => sum + product?.availableQty, 0) /
          5000) *
          100
      ),
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
              <Typography
                variant="h4"
                alignSelf="center"
                className="font-bold text-gray-800"
              >
                {" "}
                Admin Dashboard{" "}
              </Typography>
            </div>

            {/* Summary Cards */}
            <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-8">
              {cardData && cardData.map((item, index) => (
                <Card
                  key={index}
                  className="p-6 shadow-md hover:shadow-lg transition-shadow"
                >
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
                  <Typography className="mt-4 text-gray-700 font-bold">
                    {item.name}
                  </Typography>
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
                  {" "}
                  Orders Over Time{" "}
                </Typography>
                <LineChart width={400} height={300} data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <LineRechart
                    type="monotone"
                    dataKey="orders"
                    stroke="#8884d8"
                  />
                </LineChart>
              </div>
              <div className="bg-white p-4 rounded-md shadow-md">
                <Typography variant="h6" className="mb-4">
                  {" "}
                  Stock Levels{" "}
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

            <div className="bg-white p-4 rounded-md shadow-md mb-6">
              <Typography variant="h6" className="mb-4">
                {" "}
                Order Status Distribution{" "}
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

            {/* Table */}
            <div className="bg-white p-4 rounded-md shadow-md">
              <div className="flex justify-start  items-center">
                <Typography variant="h6" className="mb-4">
                  {" "}
                  Orders : {totalOrder}
                </Typography>
                
                <p>{orders.totalOrders}</p>
                
              </div>

             <OrdersTable orders={orders}/>
            </div>
            
              <div className="bg-white p-4 rounded-md shadow-md">
                <div className="flex justify-between  items-center">
                  <Typography variant="h6" className="mb-4">
                    {" "}
                    Product Management{" "}
                  </Typography>
                  <Link
                    href={"/admin/product"}
                    className="bg-[#15892e] text-white px-4 p-1 rounded-md flex gap-2 items-center"
                  >
                    <CiCirclePlus className="font-bold text-lg" /> Create
                    Product
                  </Link>
                </div>
                {products?.length !== 0 && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Category</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Life</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Price</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Stock</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Product Qty</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Min Order Qty</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Status</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Action</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products && products.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell> {row.name} </TableCell>
                          <TableCell> {row.categories} </TableCell>
                          <TableCell> {row.life} </TableCell>
                          <TableCell> {row.sellingPrice} </TableCell>
                          <TableCell> {row.availableQty} </TableCell>
                          <TableCell> {row.productQty} </TableCell>
                          <TableCell> {row.minimumOrderQty} </TableCell>
                          <TableCell>
                            {" "}
                            {row.status
                              ? row.status
                              : `${
                                  row.availableQty > 0
                                    ? "Available"
                                    : "Not Available"
                                }`}{" "}
                          </TableCell>
                          <TableCell>
                            <FaEye
                              className="text-lg text-[#15892e]"
                              onClick={() => setProductView(row)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                  )}
              </div>
          
            <div>
             
              <CreateBrand user = {user?.userType}/>
                
            </div>
            <div className="mt-8">
            
              <CreateCategory user={user?.userType}/>
            
            </div>
          </div>

          <Dialog
            open={prodductView !== null}
            onClose={() => setProductView(null)}
          >
            {prodductView && (
              <ViewProduct
                product={prodductView}
                setProduct={setProductView}
                setEditMode={setEditProduct}
              />
            )}
          </Dialog>
          <Dialog
            open={editProduct !== null}
            onClose={() => setEditProduct(null)}
          >
            {editProduct && (
              <EditProducts
                product={editProduct}
                setEditMode={setEditProduct}
              />
            )}
          </Dialog>
        </>
      )}
    </>
  );
};

export default Page;
