"use client";
import React, { useContext, useEffect, useState } from "react";
import Home from "@/Component/Home/home";
import UserContext from "@/userContext";
import Dashboard from "../Component/Admin/Dashboard/Dashboard";
import Page from "./admin/dashboard/page";

const page = () => {
  const { user } = useContext(UserContext);
  const [isAdmin, setisAdmin] = useState(false);
  useEffect(() => {
    if (user && user.userType === "admin") {
      setisAdmin(true);
    }
  }, [user]);
  return <>{isAdmin ? <Page/> : <Home />}</>;
};

export default page;
