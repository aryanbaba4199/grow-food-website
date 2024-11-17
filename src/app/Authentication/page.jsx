"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import Authform from "@/Component/user/authform";
import { posterFunction, registerApi, userAPI, userlogin } from "@/Api";
import { fetchUserDetails, logout } from "@/Redux/actions/userAuthAction";
import Swal from "sweetalert2";
import { usersAPi } from "@/Api";
import axios from "axios";
import UserContext from "@/userContext";
import { logo_uri } from "@/Api";
import Loader from "@/Component/helpers/loader";
import { useDispatch } from "react-redux";
import Head from "next/head";
import { Button } from "@mui/material";

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


  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(token)
    if (token) {
      console.log('logingg')
      router.push("/");
    }
  }, [user]);

  const handleAuthSwitch = () => {
    
    setAuthType(authType == "SignIn" ? "SignUp" : "SignIn");
  };

  const handleSubmit = async (event) => {
    setLoader(true);
    const userData = {
      email,
      password : x,
      ...(authType === "SignUp" && {
        userType,
        gst,
        shopAddress,
        name,
        mobile,
        shopName,
      }),
    };
    if(authType === "forgot"){
      console.log("Forgot Password");
      return
    }

    if (authType === "SignIn") {

      const formData = { email, password};
      
      
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
        // router.push("/");
      } catch (error) {
        console.error("Login error:", error);
        Swal.fire({
          title: "error",
          icon: "error",
          text: error.message,
        });
        setLoader(false);
      }
    } else if(authType==='SignUp') {
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
        Swal.fire({
          title: "Failure",
          icon: "error",
          text: error.message,
        });
        setLoader(false);
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
              src={logo_uri}
              alt="Grow Food"
              className=" w-32 border-green-700 shadow-black shadow-lg border-2 rounded-full p-4"
            />
            <h2 className="text-2xl font-semibold text-white bg-color-1 text-center mt-4 my-2 px-4 py-1 rounded-md">
              {authType == "SignIn" ? "Sign In" : "Create Account"}
            </h2>
          </div>

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
        <div>
          <Button onClick={()=>setAuthType('forgot')}>Forgot Password</Button>
        </div>
        </>
      )}
    </>
  );
};

export default Page;
