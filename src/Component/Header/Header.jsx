"use client";
import React, { useContext, useEffect, useState } from "react";
import Search from "./search";
import {
  FaHome,
  FaLockOpen,
  FaLock,
  FaCartPlus,
  FaRegBell,
  FaUser,
} from "react-icons/fa";
import Link from "next/link";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { MdAdminPanelSettings } from "react-icons/md";

import { MdMenu } from "react-icons/md";
import { Drawer } from "@mui/material";
import { SiIfood } from "react-icons/si";
import Profile from "../user/profile";
import UserContext from "@/userContext";

import { GrUserAdmin } from "react-icons/gr";

import { sideBarData } from "@/constants";
import AdminHeader from "./AdminHeader";
const Header = () => {
  const router = useRouter();

  const { user, token, setUser, setToken } = useContext(UserContext);

  const [showProfile, setShowProfile] = useState(false);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showDashboard, setShowDashboard] = useState(false);

  const userDetails = user;

  useEffect(() => {
    if (user) {
      if (user.userType === "admin" || user.userType == "Vendor") {
        console.log("user", user);
        setShowDashboard(true);

        router.push("/admin/dashboard");
        setLoading(true);
      }
    }
  }, [user]);

  const handleSignOut = () => {
    try {
      localStorage.removeItem("gfToken");
      localStorage.removeItem("gfuser");
      setUser(null);
      setToken(null);
      router.push("/Authentication");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {showDashboard ? (
        <AdminHeader />
      ) : (
        <div className="text-slate-950 top-0 bg-gray-200 fixed z-[500] w-full">
          {!loading && (
            <div className="flex  items-center px-4 text-sm">
              <div className="flex justify-start items-center w-full">
                <div className=" flex justify-start gap-2 items-center">
                  <MdMenu
                    onClick={() => setOpen(!open)}
                    className="text-3xl hover:cursor-pointer md:hidden block"
                  />

                  <Link href="/">
                    <Image
                      src="/favicon.ico"
                      width={50}
                      height={50}
                      className=" w-12 h-12 rounded-full p-1"
                      alt="Logo"
                    />
                  </Link>
                </div>
                <div className="md:w-[70%] w-[80%] md:ml-16 ml-2">
                <Search />
                </div>
              </div>

              <div className="md:flex hidden gap-2 w-[50%]">
                <div className="flex justify-between items-center gap-4 w-full mr-40">
                  {sideBarData.map((item, index) => (
                    <div key={index} className="w-full flex ">
                      {!showDashboard && (
                        <Link
                          className="flex-1 bg-green-100 text-green-950 font-semibold  w-20 rounded-md hover:bg-green-800 hover:text-white text-center p-1"
                          href={`${item.path}`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                  {!token ? (
                    <div className="flex ">
                    <Link
                      className="bg-gray-100 text-white bg-color-1 w-20  flex-1 rounded-md hover:bg-green-800 hover:text-white text-center p-1"
                      href="/Authentication"
                    >
                      Log in
                    </Link>
                    </div>
                  ) : (
                    <>
                      {/* <button
                    onClick={handleSignOut}
                    className="bg-gray-100 text-white bg-color-1 w-20 rounded-md hover:bg-green-800 hover:text-white text-center p-1"
                    href="Authentication"
                  >
                    {" "}
                    Log out
                  </button> */}
                    </>
                  )}
                  {token && (
                    <div className="flex w-full justify-end">
                      <FaUser  onClick={() => setShowProfile(true)}  className="bg-green-100 text-green-700 w-8 p-1 rounded-full h-8 hover:cursor-pointer"/>
                     
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <Drawer open={open} onClose={() => setOpen(false)}>
        <div className="bg-gray-100 h-full flex flex-col ">
          <div className="flex flex-col justify-center items-center mt-8 font-semibold">
            <SiIfood className="text-7xl" />
            <span className="text-lg">
              Grow <span className="text-white bg-color-1">Food</span>
            </span>
            <div className="flex flex-col gap-5 w-full mt-10">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex gap-2 hover:bg-gray-300 px-10 py-1 hover:ease-in-out hover:transform hover:text-black w-[100%]"
              >
                <span>
                  <FaHome className="mt-1 text-white bg-color-1" />
                </span>
                <span>Home</span>
              </Link>
              <Link
                href="/products"
                onClick={() => setOpen(false)}
                className="flex gap-2 hover:bg-gray-200 px-10 py-1 hover:ease-in-out hover:transform hover:text-black w-[100%]"
              >
                <span>
                  <FaCartPlus className="mt-1 text-white bg-color-1" />
                </span>
                <span>Products</span>
              </Link>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="flex gap-2 hover:bg-gray-200 px-10 py-1 hover:ease-in-out hover:transform hover:text-black w-[100%]"
              >
                <span>
                  <FaCartPlus className="mt-1 text-white bg-color-1" />
                </span>
                <span>Cart</span>
              </Link>
              {token ? (
                <button
                  onClick={handleSignOut}
                  className="flex gap-2 hover:bg-gray-200 px-10 py-1 hover:ease-in-out hover:transform hover:text-black w-[100%] "
                >
                  <span onClick={() => setUserMenu(false)}>
                    <FaLockOpen className="mt-1 text-white bg-color-1" />
                  </span>
                  <span>Log out</span>
                </button>
              ) : (
                <Link
                  href="/Authentication"
                  onClick={() => setOpen(false)}
                  className="flex gap-2 hover:bg-gray-200 px-10 py-1 hover:ease-in-out hover:transform hover:text-black w-[100%] "
                >
                  <span>
                    <FaLock className="mt-1 text-red-500" />
                  </span>
                  <span>Log In</span>
                </Link>
              )}

              {token && (
                <button
                  className="flex gap-2 hover:bg-gray-200 px-10 py-1 hover:ease-in-out hover:transform hover:text-black w-[100%] "
                  onClick={() => {
                    setShowProfile(true);
                    setOpen(false);
                  }}
                >
                  <span className="mt-1 text-white bg-color-1">
                    <MdAdminPanelSettings />
                  </span>
                  <span>Profile</span>
                </button>
              )}
              {showDashboard && (
                <button
                  className="flex gap-2 hover:bg-gray-200 px-10 py-1 hover:ease-in-out hover:transform hover:text-black w-[100%] "
                  onClick={() => router.push("/admin/dashboard")}
                >
                  <span className="mt-1 text-white bg-color-1">
                    <GrUserAdmin />
                  </span>
                  <span>Dashboard</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Drawer>

      <Drawer
        anchor="right"
        open={showProfile}
        onClose={() => setShowProfile(false)}
      >
        <Profile setOpen={setOpen} />
      </Drawer>
    </>
  );
};

export default Header;
