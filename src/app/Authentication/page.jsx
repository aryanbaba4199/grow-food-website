"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Authform from "@/Component/user/authform";
import { authApi, forgotPasswordApi, posterFunction, registerApi, userlogin } from "@/Api";
import Swal from "sweetalert2";
import UserContext from "@/userContext";
import Loader from "@/Component/helpers/loader";
import Head from "next/head";
import LoginPoster from "@/Component/helpers/LoginPoster";

const FORM_INITIAL_STATE = {
  email: "",
  password: "",
  name: "",
  mobile: "",
  shopName: "",
  gst: "",
  shopAddress: "",
  userType: "NA",
  state: "",
  city: "",
  radius: 0,
  distributionAreas: [],
};

const Page = () => {
  const [authType, setAuthType] = useState("SignIn");
  const [formData, setFormData] = useState(FORM_INITIAL_STATE);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUser, setToken, token } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (token) router.push("/");
  }, [token, router]);

  const handleAuthSwitch = () => setAuthType(authType === "SignIn" ? "SignUp" : "SignIn");

  const handleVerifyOtp = async () => {
    try {
      const res = await posterFunction(authApi.verifyOtp, { email: formData.email, otp });
      setOpen(false);
      setResetOpen(true);
      Swal.fire({ title: "Success", text: res.message, icon: "success" });
    } catch (e) {
      Swal.fire({ title: "Failed", text: e.message, icon: "error" });
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({ title: "Error", text: "Passwords do not match", icon: "error" });
      return;
    }
    try {
      const res = await posterFunction(authApi.resetPassword, { email: formData.email, newPassword });
      Swal.fire({ title: "Success", text: res.message, icon: "success" });
      setResetOpen(false);
      setAuthType("SignIn");
      router.refresh();
    } catch (e) {
      Swal.fire({ title: "Error", text: e.message, icon: "error" });
    }
  };

  const handleSubmit = async () => {
    setLoader(true);
    try {
      if (authType === "forgot") {
        if (!formData.email) {
          Swal.fire({ title: "Warning", text: "Email is required", icon: "warning" });
          return;
        }
        const res = await posterFunction(`${forgotPasswordApi}/${formData.email}`);
        setOpen(true);
        Swal.fire({ title: "Success", text: res.message, icon: "success" });
        return;
      }

      if (authType === "SignIn") {
        const response = await posterFunction(userlogin, {
          email: formData.email,
          password: formData.password,
        });
        const { token, user } = response;
        setToken(token);
        setUser(user);
        localStorage.setItem("gfuser", JSON.stringify(user));
        localStorage.setItem("gfToken", JSON.stringify(token));
        router.push("/");
        Swal.fire({ title: "Success", text: "Logged in successfully", icon: "success" });
      } else if (authType === "SignUp") {
        const res = await posterFunction(registerApi, formData);
        Swal.fire({ title: "Success", text: "Thanks for joining Grow Food", icon: "success" });
        setAuthType("SignIn");
      }
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message, icon: "error" });
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <Head>
        <title>The Grow Food</title>
        <meta name="description" content="The Grow Food Is B2B solution for Restaurants" />
        <meta name="keywords" content="Restaurants, Hotels, Foods, B2B" />
      </Head>
      {loader ? (
        <Loader />
      ) : (
        <div className="flex min-h-screen bg-gray-50">
          <div className="hidden md:flex md:w-2/3 p-8 justify-center items-center bg-gradient-to-r from-green-100 to-yellow-100">
            <LoginPoster />
          </div>
          <div className="w-full md:w-1/3 bg-white shadow-xl rounded-lg min-h-screen p-6 flex flex-col justify-center">
            <div className="flex flex-col items-center mb-6">
              <img
                src="/favicon.ico"
                alt="Grow Food"
                className="w-24 h-24 border-4 border-yellow-400 rounded-full p-2 shadow-md"
              />
              <h2 className="text-2xl font-bold text-green-600 mt-4">
                {authType === "SignIn" ? "Sign In" : "Create Account"}
              </h2>
            </div>
            <Authform
              authType={authType}
              formData={formData}
              setFormData={setFormData}
              handleAuthSwitch={handleAuthSwitch}
              handleSubmit={handleSubmit}
              open={open}
              resetOpen={resetOpen}
              otp={otp}
              setOtp={setOtp}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              handleVerifyOtp={handleVerifyOtp}
              handleResetPassword={handleResetPassword}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Page;