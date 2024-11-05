'use client'
import { getuserAddress, getUserApi, usersAPi } from "@/Api";
import axios from "axios";
import CryptoJS from "crypto-js";

const cryptoKey = process.env.NEXT_PUBLIC_CRYPTO_KEY;

export const getUserDetails = (id) => {
  try {
    const res = axios.get(`${getUserApi}/${id}`);
    if (res.status === 200) {
      return { status: true, data: res.data };
    } else {
      return { status: false, data: res.data };
    }
  } catch (err) {
    return { status: false, data: err.data };
  }
};

export const fetchUserDetails = async () => {
  try {
    const token = decryptData(localStorage.getItem("token"));
    if (token) {
      const response = await axios.get(`${usersAPi}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const secureData = encryptData(response.data);
      localStorage.setItem("user", secureData);
      return { data: response.data, status: true };
    }
  } catch (err) {
    return { status: false, data: err };
  }
};


export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), cryptoKey).toString();
};

export const decryptData = (ciphertext) => {
  if (ciphertext !== '' && ciphertext !== null) {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, cryptoKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
  
      console.error('Error during decryption:', error);
      console.error('Stack trace:', new Error().stack);
      return null;
    }
  } else {
    return null;
  }
};


export const getAddress = async () => {
  try {
    const res = await axios.get(`${getuserAddress}/${decryptData(localStorage.getItem('user')).user._id}`);
    if (res.status === 200) {
     
      localStorage.setItem("userAddress", encryptData(res.data));
      return {data: res.data, response : true};
    }
  } catch (e) {
    console.error(e);
    return {data: e, response : true};
  }
};