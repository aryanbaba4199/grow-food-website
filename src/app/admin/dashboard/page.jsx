"use client";
import React, { useEffect } from "react";
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
} from "@mui/material";
import {
  AiFillProject,
} from "react-icons/ai";
import {
  MdOutlineProductionQuantityLimits,
  MdShowChart,
} from "react-icons/md";
import {
  Line,
  Circle
} from "rc-progress";
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
  Legend
} from "recharts";
import {
    useSpring,
    animated
  } from "@react-spring/web";
import Link from "next/link";

const cardData = [
  {
    icon: <MdOutlineProductionQuantityLimits className="text-3xl text-green-600" />,
    name: "Products",
    progress: 70,
    volume: 5000
  },
  {
    icon: <AiFillProject className="text-3xl text-orange-500" />,
    name: "Stocks",
    progress: 50,
    volume: 1500
  },
  {
    icon: <MdShowChart className="text-3xl text-blue-500" />,
    name: "Orders",
    progress: 90,
    volume: 1200
  },
  {
    icon: <AiFillProject className="text-3xl text-red-500" />,
    name: "Rejected",
    progress: 30,
    volume: 300
  },
];

// Dummy data for Recharts
const lineChartData = [
  {
    name: "Jan",
    orders: 40
  },
  {
    name: "Feb",
    orders: 30
  },
  {
    name: "Mar",
    orders: 20
  },
  {
    name: "Apr",
    orders: 27
  },
  {
    name: "May",
    orders: 18
  },
  {
    name: "Jun",
    orders: 23
  },
];

const barChartData = [
  {
    name: "Product A",
    stock: 400
  },
  {
    name: "Product B",
    stock: 300
  },
  {
    name: "Product C",
    stock: 500
  },
];

const pieData = [
  { name: "Success", value: 400, color: "#4caf50" },
  { name: "Failed", value: 100, color: "#f44336" },
  { name: "Pending", value: 200, color: "#ffeb3b" },
];

const dummyTableData = [{
    id: 1,
    name: "Product 1",
    category: "Category A",
    status: "Active"
  },
  {
    id: 2,
    name: "Product 2",
    category: "Category B",
    status: "Inactive"
  },
  {
    id: 3,
    name: "Product 3",
    category: "Category A",
    status: "Pending"
  },
];

const AnimatedNumber = ({ number }) => {
    const { value } = useSpring({
      from: { value: 0 },
      to: { value: number},
      config: { duration: 4000 },
      reset: true,
      cancel : false,
    });
  
    return <animated.span>{value.to((v) => Math.floor(v))}</animated.span>;
  }

 

const Page = () => {
  return ( 
    <div className = "min-h-screen bg-gray-100 p-4" >
      {/* Header */} 
      <div className = "bg-white p-4 rounded-md shadow-md mb-6" >
        <Typography variant = "h4" className = "font-bold text-gray-800"> Admin Dashboard </Typography>
        <Link href='/admin/product'>Products</Link> 
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
            <Typography className="mt-4 text-gray-700 font-bold">
              {item.name}
            </Typography>
            <Typography className="text-gray-500">
              <AnimatedNumber number={item.volume}/> 
            </Typography>
          </Card>
        ))}
      </div>
    

      {/* Charts */} 
      <div className = "grid lg:grid-cols-2 sm:grid-cols-1 gap-8 mb-6 mt-8" >
        <div className = "bg-white p-4 rounded-md shadow-md" >
          <Typography variant = "h6" className = "mb-4"> Orders Over Time </Typography> 
          <LineChart width = {400} height = {300} data = {lineChartData} >
            <CartesianGrid strokeDasharray = "3 3" />
            <XAxis dataKey = "name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <LineRechart type = "monotone" dataKey = "orders" stroke = "#8884d8" />
          </LineChart> 
        </div> 
        <div className = "bg-white p-4 rounded-md shadow-md" >
          <Typography variant = "h6" className = "mb-4"> Stock Levels </Typography> 
          <BarChart width = {400} height = {300} data = {barChartData} >
            <CartesianGrid strokeDasharray = "3 3" />
            <XAxis dataKey = "name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey = "stock" fill = "#82ca9d" />
          </BarChart> 
        </div> 
      </div>

      <div className = "bg-white p-4 rounded-md shadow-md mb-6" >
        <Typography variant = "h6" className = "mb-4"> Order Status Distribution </Typography> 
        <PieChart width = {400} height = {300} >
          <Pie
            data = {pieData}
            cx = {200}
            cy = {150}
            outerRadius = {80}
            fill = "#8884d8"
            dataKey = "value"
            label >
            {pieData.map((entry, index) => ( 
              <Cell key = {`cell-${index}`} fill = {entry.color}/>
            ))}
          </Pie> 
          <Tooltip />
        </PieChart> 
      </div>

      {/* Table */} 
      <div className = "bg-white p-4 rounded-md shadow-md" >
        <Typography variant = "h6" className = "mb-4"> Product Management </Typography> 
        <TableContainer component = {Paper} >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead> 
            <TableBody> 
              {
                dummyTableData.map((row) => ( 
                  <TableRow key = {row.id} >
                    <TableCell> {row.id} </TableCell> 
                    <TableCell> {row.name} </TableCell> 
                    <TableCell> {row.category} </TableCell> 
                    <TableCell> {row.status} </TableCell> 
                    <TableCell> 
                      <Button size = "small" variant = "outlined" color = "primary" className = "mr-2" > Edit </Button> 
                      <Button size = "small" variant = "outlined" color = "secondary" > Delete </Button> 
                    </TableCell> 
                  </TableRow>
                ))
              } 
            </TableBody> 
          </Table> 
        </TableContainer> 
      </div> 
    </div>
  );
};

export default Page;
