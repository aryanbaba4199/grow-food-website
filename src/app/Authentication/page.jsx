"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import Authform from "@/Component/user/authform";
import {
  authApi,
  forgotPasswordApi,
  getterFunction,
  getUserApi,
  posterFunction,
  registerApi,
  userAPI,
  userlogin,
} from "@/Api";
import { fetchUserDetails, logout } from "@/Redux/actions/userAuthAction";
import Swal from "sweetalert2";
import { usersAPi } from "@/Api";
import axios from "axios";
import UserContext from "@/userContext";
import { logo_uri } from "@/Api";
import Loader from "@/Component/helpers/loader";
import { useDispatch } from "react-redux";
import Head from "next/head";
import { Button, TextField } from "@mui/material";
import Analytics from "@/Component/Admin/Analytics";

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
    console.log(token);
    if (token) {
      console.log("logingg");
      router.push("/");
    }
  }, [user]);

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
          <div className="mt-8">
            <div className="flex flex-col justify-center items-center">
              <img
                src="/favicon.ico"
                alt="Grow Food"
                className=" w-32 h-32 border-green-700 shadow-black shadow-lg border-2 rounded-full p-4"
              />
              <h2 className="text-2xl font-semibold text-white bg-color-1 text-center mt-4 my-2 px-4 py-1 rounded-md">
                {authType == "SignIn" ? "Sign In" : "Create Account"}
              </h2>
            </div>
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
                <p className="font-semibold text-lgg my-4">
                  Please enter OTP ( You can get this on your email ){" "}
                </p>
                <TextField
                  type="number"
                  required
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                />
              </div>
            )}
            <>
              {resetOpen && (
                <>
                  <div className="flex justify-center items-center">
                    <div className="flex flex-col gap-4">
                      <TextField
                        required
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                      />
                      <TextField
                        required
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
            {user?.user && (
              <div className="mt-8 text-white">
                <h3>User Details:</h3>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Mobile: {user.mobile}</p>
                {/* <p>Address: {user.address.address}, {user.address.city}, {user.address.state} - {user.address.zip}</p> */}
                <button onClick={() => dispatch(logout())}>Sign Out</button>
              </div>
            )}
          </div>
          {open && (
            <>
              <div className="flex justify-center items-center mt-4">
                <button
                  onClick={handleVerifyOtp}
                  className="bg-[#15892e] px-4 py-2 rounded-md text-white my-2"
                >
                  Validate OTP
                </button>
              </div>
            </>
          )}
          {resetOpen && (
            <>
              <div className="flex justify-center items-center mt-4">
                <button
                  onClick={handleResetPassword}
                  className="bg-[#15892e] px-4 py-2 rounded-md text-white my-2"
                >
                  Validate OTP
                </button>
              </div>
            </>
          )}
          <div className="flex justify-center py-4">
            <Button onClick={() => setAuthType("forgot")}>
              Forgot Password
            </Button>
          </div>
        </>
      )}
      
    </>
  );
};

export default Page;
