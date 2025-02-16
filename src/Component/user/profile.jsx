import React, { useContext, useEffect, useState } from "react";
import UserContext from "@/userContext";
import axios from "axios";
import { FaDeleteLeft, FaPlus } from "react-icons/fa6";
import { createAddress, deleteAddressApi, DeleteApi, deleteCartItem, getterFunction } from "@/Api";
import Swal from "sweetalert2";
import { getuserAddress } from "@/Api";

import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  Dialog,
  Drawer,
  textFieldClasses,
} from "@mui/material";
import Link from "next/link";
import { FaEye, FaLock } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Image from "next/image";
import { updateUserDetails } from "@/Api";
import deleteImageFromCloudinary from "@/Context/functions";
import { uploadImageToCloudinary } from "@/Context/functions";
import { encryptData } from "@/Context/userFunction";

const defaultformData = {
  name: "",
  mobile: "",
  locality: "",
  city: "",
  state: "",
  zip: "",
  landmark: "",
};

const Profile = (setOpen) => {
  const { user, setUser, setToken } = useContext(UserContext);
  const defaultProfileForm = {
    image: user?.image,
    tempImageUrl : user?.image,
    shopName: user?.shopName,
    name: user?.name,
    mobile: user?.mobile,
  };
  const [imageId, setImageId] = useState("");
  const [address, setAddress] = useState([]);
  const [addressmode, setAddressMode] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [image, setImage] = useState("");
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [profileForm, setProfileForm] = useState(defaultProfileForm);
  const [formData, setFormData] = useState(defaultformData);
  const [showAddress, setShowAddress] = useState(false);
 

  useEffect(() => {
    getAddress(user?._id);
  }, [user, user?._id]);

  const handleChange = (e) => {
    if (formData.userId === "") {
      setFormData({
        ...formData,
        userId: user._id,
      });
    }
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileChange = (e) => {
    if (profileForm.userId === "") {
      setProfileForm({
        ...profileForm,
        userId: user._id,
      });
    }
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value,
    });
  };

  const handleAddAddress = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post(`${createAddress}`, { address: formData });
      if (res.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Address successfully added",
          icon: "success",
        });
        getAddress(user._id);
        setAddressMode(false);
      }
    } catch (e) {
      console.error(e);
      Swal.fire({
        title: "Error",
        icon: "error",
        text: e.message,
      });
    }
  };

  const getAddress = async () => {
    try {
      const res = await getterFunction(`${getuserAddress}/${user._id}`);
      if (res) {
        console.log(res);
       
        setAddress(res);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadImage = async () => {
    if (image === "") {
      handleUpdateProfile();
    } else {
      try {
        const data = await uploadImageToCloudinary(image);
    

        if (data.response) {
         
          setProfileForm({
            ...profileForm,
            image: data.data.secure_url,
          });

          setImageId(data.data.public_id);

          setTempImageUrl("");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (imageId !== "") {
      handleUpdateProfile();
    }
  }, [imageId]);

  const handleImageChange = (e) => {
    const selectImage = e.target.files[0];
    if (selectImage) {
      const tempUrl = URL.createObjectURL(selectImage);
      setTempImageUrl(tempUrl);
      setImage(selectImage);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await axios.put(`${updateUserDetails}/${user._id}`, {
        formData: profileForm,
      });
      if (res.status === 200) {
        Swal.fire({
          title: "Success ",
          icon: "success",
          text: "Profile updated successfully... request you to Relogin for get updated profile",
        });
      }
      setEditProfile(false);
    } catch (err) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: err.message,
      });
      console.error(err);
      deleteImageFromCloudinary(imageId);
    }
  };

  const hanldeDeleteAddress = async(id)=>{
    try{
      const res = await DeleteApi(`${deleteAddressApi}/${id}`)
      if(res){
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Address deleted successfully",
        });
        getAddress();
      }
    }catch(e){
      console.error('Error in Deleting Address', e);
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Failed to delete address",
      });
    }
  }

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
      {addressmode ? (
        <>
          <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom className="mt-4">
              Create Address
            </Typography>
            <form onSubmit={handleAddAddress}>
              <Grid container spacing={2} className="grid grid-cols-2">
                <Grid item xs={12}>
                  <TextField
                    label="User ID"
                    name="userId"
                    value={user._id}
                    type="password"
                    disabled
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    onMouseLeave={() => {
                      setFormData({
                        ...formData,
                        userId: user._id,
                      });
                    }}
                    onBlur={() => {
                      setFormData({
                        ...formData,
                        userId: user._id,
                      });
                    }}
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Locality"
                    name="locality"
                    value={formData.locality}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="ZIP"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                className="flex justify-between items-center mt-8 fl"
              >
                <Button onClick={() => setAddressMode(false)}>Close</Button>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </form>
          </Container>
        </>
      ) : (
        <div className="bg-gray-100">
          <div>
            <div className="flex ml-4 justify-center items-center">
              <img
                src={
                  user?.image !== undefined
                    ? user.image
                    : "https://i.pinimg.com/1200x/56/4b/69/564b698d4cf3a5b61e3318064549b35c.jpg"
                }
                width={150}
                height={150}
                className="rounded-full w-48 h-48 mx-8 border-2 border-[#1e4426] shadow-md shadow-[#1e4426] mt-1"
              />
              <FaEdit
                className="text-[#1e4426] hover:cursor-pointer text-xl"
                onClick={() => {
                  setEditProfile(true);
                  setProfileForm({
                    ...profileForm,
                    userId: user._id,
                    shopName: user.shopName,
                    name: user.name,
                    mobile: user.mobile,
                  });
                }}
              />
            </div>
            <div className="flex flex-col justify-center items-center mt-4 gap-2 ">
              <span className="font-semibold text-xl px-4 py-1 bg-color-1 rounded-lg text-white">
                {user?.name}
              </span>
              <span className="text-sm border-[1px] border-[#1e4426] rounded-sm px-2 py-1">
                {user?.email}
              </span>
            </div>
            <div>
              <div className="flex justify-between items-center mt-4 px-4 bg-green-50 text-green-600">
                <Link href="/Orders" className="font font-semibold text-green-600">
                  Orders : {user?.orderLength ?? 0}{" "}
                </Link>
                <FaEye
                  className=" react-icons text-lg"
                  
                />
              </div>
              <div className="flex justify-between items-center mt-2 px-4 bg-green-50 text-green-600">
                <Link href="/cart" className="font font-semibold text-green-600">
                  Cart : {user?.cartLength}
                </Link>
                <FaEye
                  className=" react-icons text-lg"
                  
                />
              </div>
              <div className="flex justify-between items-center mt-2 px-4 bg-green-50 text-green-600 hover:cursor-pointer">
                <span className="font font-semibold text-green-600" onClick={()=>setShowAddress(!showAddress)}>
                  Address : {address.length}{" "}
                </span>
                <FaPlus
                  className=" react-icons text-lg"
                  onClick={() => setAddressMode(!addressmode)}
                />
              </div>

              <div className="flex justify-between items-center mt-2 px-4 bg-green-50 text-green-600 hover:cursor-pointer">
                <span className="font font-semibold text-green-600" onClick={handleSignOut}>
                  Sign Out
                </span>
                <FaLock
                  className=" react-icons text-lg"
                  onClick={handleSignOut}
                />
              </div>
            </div>
            {showAddress &&
            <div className="flex flex-col gap-4">
              {address.map((item, index) => (
                <div key={index} className="flex flex-col bg-gray-100 text-sm shadow-md  mt-2 px-4">
                  <span>Name : {item.name}</span>
                  <span>Mobile : {item.mobile}</span>
                  <div className="flex flex-wrap gap-2 flex-row mt-1 text-sm text-gray-700">
                    <span>{item.landmark}</span>
                    <span>{item.locality}</span>
                    <span>{item.city}</span>
                    <span>{item.state}</span>
                    <span>{item.zip}</span>
                  </div>
                  <div className="absolute right-4 text-lg text-red-600">
                    <FaDeleteLeft className="hover:cursor-pointer" onClick={()=>hanldeDeleteAddress(item._id)}/>
                  </div>
                </div>
                
              ))}
            </div>
            }
          </div>
        </div>
      )}
      <Drawer
        open={editProfile}
        anchor="left"
        onClose={() => setEditProfile(false)}
      >
        <div className="w-auto h-full bg-gray-100">
        <div className="bg-color-1 flex justify-center items-center">
          <span className="text-xl font-semibold">Edit Profile</span>
        </div>
        <div className="pt-4 bg-gray-100">
          <div className="mb-6 flex flex-col mt-4 px-2  justify-between">
            {tempImageUrl !== "" && (
              <Image
                src={tempImageUrl}
                width={100}
                height={100}
                className=" w-36 h-36 mt-2 self-center rounded-full"
                alt="Grow Food"
              />
            )}
            <input
              type="file"
              accept="image/*"
              className="px-2 text-black mt-4"
              onChange={handleImageChange}
              required
            />
          </div>
        </div>
        <div className="flex gap-4 bg-gray-100 flex-col mx-4">
          <TextField
            label="Shop Name"
            name="shopName"
            variant="outlined"
            fullWidth
            value={profileForm.shopName ?? ""}
            onChange={handleProfileChange}
            className=" mx-4 my-2"
            size="small"
          />
          <TextField
            label="Contact Person Name"
            name="name"
            variant="outlined"
            fullWidth
            value={profileForm.name ?? ""}
            onChange={handleProfileChange}
            className="w-auto mx-4 my-2"
            size="small"
          />
          <TextField
            label="Mobile"
            name="mobile"
            variant="outlined"
            fullWidth
            value={profileForm.mobile ?? ""}
            onChange={handleProfileChange}
            className="w-auto mx-4 my-2 mt-2"
            size="small"
          />
        </div>
        <div className="flex justify-between px-4 items-center mt-4">
        <Button variant="contained" color="inherit" onClick={()=>{setEditProfile(false)}}>
            Close
          </Button> 
          
          <Button
            onClick={() => handleUploadImage()}
            variant="contained"
            className="bg-color-1"
            color="success"
            
          >
            Update
          </Button>
          
        </div>
        </div>
      </Drawer>
      
    </>
  );
};

export default Profile;