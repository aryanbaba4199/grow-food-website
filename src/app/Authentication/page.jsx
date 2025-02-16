"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import Authform from "@/Component/user/authform";
import {
  authApi,
  forgotPasswordApi,
  getterFunction,
  posterFunction,
  registerApi,
  userlogin,
} from "@/Api";
import { logout } from "@/Redux/actions/userAuthAction";
import Swal from "sweetalert2";

import axios from "axios";
import UserContext from "@/userContext";

import Loader from "@/Component/helpers/loader";
import { useDispatch } from "react-redux";
import Head from "next/head";
import { Button, TextField } from "@mui/material";

import LoginPoster from "@/Component/helpers/LoginPoster";

const Page = () => {
  const [authType, setAuthType] = useState("SignIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const { user, setUser, setToken, token } = useContext(UserContext);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loader, setLoader] = useState(false);
  const [userType, setUserType] = useState("NA");
  const [gst, setGst] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(token);
      if (token) {
        console.log("logingg");
        router.push("/");
      }
    }
  }, [token]);
  
  

  const handleAuthSwitch = () => {
    setAuthType(authType == "SignIn" ? "SignUp" : "SignIn");
  };

  const handleVerifyOtp = async () => {
    try {
      const formData = {
        email,
        otp,
      };
      const res = await posterFunction(authApi.verifyOtp, formData);
      setOpen(false);
      setResetOpen(true);
      Swal.fire({
        title: "Successfull",

        text: res.message,
        icon: "success",
      });
    } catch (e) {
      Swal.fire({
        title: "Failed",
        text: e.message,
        icon: "error",
      });
      console.error(e);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Password mismatch",
        icon: "error",
      });
      return;
    }
    try {
      const formData = {
        email,
        newPassword,
      };
      const res = await posterFunction(authApi.resetPassword, formData);
      Swal.fire({
        title: "Success",
        icon: "success",
        text: res.message,
      });
      setResetOpen(false);
      setAuthType("SignIn");
      router.refresh();
    } catch (e) {
      console.error(e);
      Swal.fire({
        title: "Error",
        text: e,
        icon: "error",
      });
    }
  };

  const handleSubmit = async (event) => {
    setLoader(true);
    const userData = {
      email,
      password,
      ...(authType === "SignUp" && {
        userType,
        gst,
        shopAddress,
        name,
        mobile,
        shopName,
      }),
    };
    if (authType === "forgot") {
      if (!email) {
        setLoader(false);
        Swal.fire({
          title: "Warning",
          icon: "warning",
          text: "Email is required",
        });
        return;
      }
      try {
        const res = await getterFunction(`${forgotPasswordApi}/${email}`);
        setOpen(true);
        Swal.fire({
          title: "Successful",
          text: res.message,
          icon: "success",
        });
      } catch (e) {
        Swal.fire({
          title: "Failure",
          text: e,
          icon: "success",
        });
        console.error(e);
      } finally {
        setLoader(false);
        return;
      }
    }

    if (authType === "SignIn") {
      const formData = { email, password };

      try {
        const response = await posterFunction(userlogin, formData);
        const { token, user } = response;
        console.log(response);

        setToken(token);
        setUser(user);
        console.log(response);
        localStorage.setItem("gfuser", JSON.stringify(user));
        localStorage.setItem("gfToken", token);
        router.refresh();
        Swal.fire({
          title: "success",
          icon: "success",
          text: "Log in Successfully",
        });
        setLoader(false);
        router.push("/");
      } catch (error) {
        console.error("Login error:", error);
        setLoader(false);
        Swal.fire({
          title: "error",
          icon: "error",
          text: error.message,
        });
      }
    } else if (authType === "SignUp") {
      try {
        const res = await axios.post(registerApi, userData);
        if (res.status === 200) {
          setAuthType("SignIn");
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Thanks for joining Grow Food",
            confirmButtonText: "OK",
          }).then(async (result) => {
            if (result.isConfirmed && authType === "SignIn") {
              await handleSubmit();
            }
          });

          setLoader(false);
        }
      } catch (error) {
        console.error("Registration error:", error);
        setLoader(false);
        Swal.fire({
          title: "Failure",
          icon: "error",
          text: error.message,
        });
      }
    }
  };

  return (
    <>
      <Head>
        <title>The Grow Food</title>
        <meta
          name="description"
          content="The Grow Food Is B2B solution for Restaurants"
        />
        <meta name="keywords" content=" Rastaurants, Hotels, Foods, B2B" />
      </Head>
      {loader ? (
        <Loader />
      ) : (
        <>
          <div className="flex min-h-screen bg-gray-100">
            {/* Left Section - LoginPoster */}
            <div className="w-[70%] p-8 flex justify-center items-center">
              <LoginPoster />
            </div>

            {/* Right Section - Auth Section */}
            <div className="mt-8 w-[30%] bg-white rounded-lg shadow-lg min-h-screen p-6">
              <div className="flex flex-col justify-center items-center">
                <img
                  src="/favicon.ico"
                  alt="Grow Food"
                  className="w-32 h-32 border-4 border-yellow-400 shadow-lg rounded-full p-4"
                />
                <h2 className="text-3xl font-semibold text-yellow-600 mt-6 mb-4">
                  {authType === "SignIn" ? "Sign In" : "Create Account"}
                </h2>
              </div>

              {/* Auth Form or OTP Section */}
              {!open ? (
                <Authform
                  authType={authType}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  name={name}
                  setName={setName}
                  mobile={mobile}
                  setMobile={setMobile}
                  handleAuthSwitch={handleAuthSwitch}
                  handleSubmit={handleSubmit}
                  shopName={shopName}
                  setShopName={setShopName}
                  gst={gst}
                  setGst={setGst}
                  shopAddress={shopAddress}
                  setShopAddress={setShopAddress}
                  setUserType={setUserType}
                />
              ) : (
                <div className="flex justify-center items-center flex-col">
                  <p className="font-semibold text-lg my-4">
                    Please enter OTP (You can get this on your email)
                  </p>
                  <TextField
                    type="number"
                    required
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                    className="w-full p-2 border-2 border-gray-300 rounded-md mb-4"
                  />
                </div>
              )}

              {/* Password Reset Section */}
              {resetOpen && (
                <div className="flex justify-center items-center flex-col mt-4">
                  <TextField
                    required
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full p-2 border-2 border-gray-300 rounded-md mb-4"
                  />
                  <TextField
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="w-full p-2 border-2 border-gray-300 rounded-md mb-4"
                  />
                </div>
              )}

              {/* User Info Section */}
              {user?.user && (
                <div className="mt-8 text-gray-700">
                  <h3 className="font-semibold text-lg mb-2">User Details:</h3>
                  <p>Name: {user.name}</p>
                  <p>Email: {user.email}</p>
                  <p>Mobile: {user.mobile}</p>
                  <button
                    onClick={() => dispatch(logout())}
                    className="mt-4 text-yellow-600 hover:text-yellow-500"
                  >
                    Sign Out
                  </button>
                </div>
              )}

              {/* OTP Validation & Forgot Password Buttons */}
              {open && (
                <div className="flex justify-center items-center mt-6">
                  <button
                    onClick={handleVerifyOtp}
                    className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-500 transition duration-300"
                  >
                    Validate OTP
                  </button>
                </div>
              )}

              {resetOpen && (
                <div className="flex justify-center items-center mt-6">
                  <button
                    onClick={handleResetPassword}
                    className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-500 transition duration-300"
                  >
                    Reset Password
                  </button>
                </div>
              )}

              <div className="flex justify-center py-4">
                <Button
                  onClick={() => setAuthType("forgot")}
                  className="text-yellow-600 hover:text-yellow-500"
                >
                  Forgot Password
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
