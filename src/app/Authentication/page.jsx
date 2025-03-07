"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Authform from "@/Component/user/authform";
import { authApi, forgotPasswordApi, posterFunction, getterFunction, registerApi, userlogin } from "@/Api";
import { logout } from "@/Redux/actions/userAuthAction";
import Swal from "sweetalert2";
import UserContext from "@/userContext";
import Loader from "@/Component/helpers/loader";
import { useDispatch } from "react-redux";
import Head from "next/head";
import LoginPoster from "@/Component/helpers/LoginPoster";

const Page = () => {
  const [authType, setAuthType] = useState("SignIn");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    mobile: "",
    shopName: "",
    gst: "",
    shopAddress: "",
    userType: "NA",
    state : "",
    city: "",
    distributionAreas: [],
  });
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user, setUser, setToken, token } = useContext(UserContext);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token]);

  const handleAuthSwitch = () => {
    setAuthType(authType === "SignIn" ? "SignUp" : "SignIn");
  };

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
      Swal.fire({ title: "Error", text: "Password mismatch", icon: "error" });
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
    if (authType === "forgot") {
      if (!formData.email) {
        Swal.fire({ title: "Warning", text: "Email is required", icon: "warning" });
        setLoader(false);
        return;
      }
      try {
        const res = await getterFunction(`${forgotPasswordApi}/${formData.email}`);
        setOpen(true);
        Swal.fire({ title: "Success", text: res.message, icon: "success" });
      } catch (e) {
        Swal.fire({ title: "Failure", text: e.message, icon: "error" });
      } finally {
        setLoader(false);
      }
      return;
    }

    if (authType === "SignIn") {
      try {
        const response = await posterFunction(userlogin, { email: formData.email, password: formData.password });
        const { token, user } = response;
        setToken(token);
        setUser(user);
        localStorage.setItem("gfuser", JSON.stringify(user));
        localStorage.setItem("gfToken", token);
        router.push("/");
        Swal.fire({ title: "Success", text: "Logged in successfully", icon: "success" });
      } catch (error) {
        Swal.fire({ title: "Error", text: error.message, icon: "error" });
      } finally {
        setLoader(false);
      }
    } else if (authType === "SignUp") {
      try {
        const res = await posterFunction(registerApi, formData);
        
          Swal.fire({ title: "Success", text: "Thanks for joining Grow Food", icon: "success" });
          setAuthType("SignIn");
        
      } catch (error) {
        Swal.fire({ title: "Failure", text: error.message, icon: "error" });
      } finally {
        setLoader(false);
      }
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
        <div className="flex min-h-screen bg-gray-100">
          <div className="w-[70%] p-8 flex justify-center items-center">
            <LoginPoster />
          </div>
          <div className="mt-8 w-[30%] bg-white rounded-lg shadow-lg min-h-screen p-6">
            <div className="flex flex-col justify-center items-center">
              <img src="/favicon.ico" alt="Grow Food" className="w-32 h-32 border-4 border-yellow-400 shadow-lg rounded-full p-4" />
              <h2 className="text-3xl font-semibold text-yellow-600 mt-6 mb-4">
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