'use client'
import { Drawer, Badge, IconButton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

import { MdDashboard, MdNotifications, MdLogout } from "react-icons/md";
import UserContext from "@/userContext";
import { useRouter } from "next/navigation";


const AdminHeader = () => {

  const router = useRouter(); 
  const {user, setUser, setToken } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(()=>{
    if (user && (user.userType === 'admin' && user.userType === 'Vendor')){
      setIsAdmin(true)
    }
  }, [user])
  
  const handleSignOut = () => {
    try {
      localStorage.removeItem("gfToken");
      localStorage.removeItem("gfuser");
      setUser(null);
      setToken(null);
      setIsAdmin
      router.push("/Authentication");
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="flex absolute top-0 justify-between items-center px-6 py-2 bg-gray-800 text-white w-full z-50 shadow-md">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard">
          <Image
            src="/favicon.ico"
            width={50}
            height={50}
            className="w-12 h-12 rounded-full p-1 border border-white"
            alt="Logo"
          />
        </Link>
      </div>

      {!isAdmin && 
      <div className="flex items-center gap-6">
        <IconButton className="text-white">
          <Badge badgeContent={3} color="error">
            <MdNotifications className="text-2xl text-white" />
          </Badge>
        </IconButton>

        <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition">
          <MdLogout className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
      }
    </div>
  );
};

export default AdminHeader;
