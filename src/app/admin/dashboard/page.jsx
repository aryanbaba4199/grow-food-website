"use client";
import React, { useContext, useEffect, useState } from "react";
import { FaCartArrowDown, FaImages } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { RiAlignItemBottomFill } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";
import Dashboard from "@/Component/Admin/Dashboard/Dashboard";
import Order from "@/Component/vendors/Order";
import Products from "@/Component/vendors/Products";
import UserContext from "@/userContext";
import { useRouter } from "next/navigation";
import CreateBrand from "@/Component/Admin/createBrand";
import CreateCategory from "@/Component/Admin/createCategory/createCategory";
import { MdOutlineCategory } from "react-icons/md";
import { TbBrandCupra } from "react-icons/tb";
import { IoChatbox } from "react-icons/io5";
import Chat from "@/Component/Admin/Chat/Chat";
import Sliders from "@/Component/Admin/Sliders/Sliders";



const Page = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const {user} = useContext(UserContext)
  const router = useRouter()

  useEffect(() => {
    if (user && (user.userType !== 'admin' && user.userType !== 'Vendor')) {
      router.push('/');
    }
  }, [user]);

  const tabs = [
    { name: "Dashboard", icon: <MdDashboard className="text-2xl" />, component: <Dashboard /> },
    { name: "Orders", icon: <FaCartArrowDown className="text-2xl" />, component: <Order /> },
    { name: "Products", icon: <RiAlignItemBottomFill className="text-2xl" />, component: <Products /> },
    { name: "Categories", icon: <MdOutlineCategory className="text-2xl" />, component: <CreateCategory user={user?.userType}/> },
    { name: "Brands", icon: <TbBrandCupra className="text-2xl" />, component: <CreateBrand user={user?.userType}/> },
    { name: "Chats", icon: <IoChatbox className="text-2xl" />, component: <Chat user={user}/> },
    { name: "Sliders", icon: <FaImages className="text-2xl" />, component: <Sliders user={user}/> },



  ];
  

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/6 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
        <div className="flex flex-col gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-3 px-3 py-1 rounded-md transition-all text-md 
              ${activeTab === tab.name ? "bg-white text-black shadow-lg" : "hover:bg-gray-700"}`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 bg-gradient-to-br from-[#FFFFF0] via-white to-[#f9f6fa] from overflow-auto p-6">
        {tabs.find((tab) => tab.name === activeTab)?.component || <div className="text-center text-xl">Select a section</div>}
      </div>
    </div>
  );
};

export default Page;
