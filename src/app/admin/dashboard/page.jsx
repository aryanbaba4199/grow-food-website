"use client";
import React, { useContext, useEffect, useState } from "react";
import { FaCartArrowDown } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { RiAlignItemBottomFill } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";
import Dashboard from "@/Component/Admin/Dashboard/Dashboard";
import Order from "@/Component/vendors/Order";
import Products from "@/Component/vendors/Products";
import UserContext from "@/userContext";
import { useRouter } from "next/navigation";

const tabs = [
  { name: "Dashboard", icon: <MdDashboard className="text-2xl" />, component: <Dashboard /> },
  { name: "Orders", icon: <FaCartArrowDown className="text-2xl" />, component: <Order /> },
  { name: "Products", icon: <RiAlignItemBottomFill className="text-2xl" />, component: <Products /> },
  { name: "Reports", icon: <TbReportSearch className="text-2xl" />, component: null },
];

const Page = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const {user} = useContext(UserContext)
  const router = useRouter()

  useEffect(() => {
    if (user && (user.userType !== 'admin' && user.userType !== 'Vendor')) {
      router.push('/');
    }
  }, [user]);
  

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
        <div className="flex flex-col gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-3 p-3 rounded-md transition-all text-lg 
              ${activeTab === tab.name ? "bg-white text-black shadow-lg" : "hover:bg-gray-700"}`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 bg-gray-100 overflow-auto p-6">
        {tabs.find((tab) => tab.name === activeTab)?.component || <div className="text-center text-xl">Select a section</div>}
      </div>
    </div>
  );
};

export default Page;
