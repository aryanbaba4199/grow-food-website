'use client'
import {
  categoryApi,
  getBrandsApi,
  getCategoriesApi,
  getProductbySubCategory,
  getProductsApi,
  getUnitApi,

} from "@/Api";
import axios from "axios";
import { encryptData, decryptData } from "./userFunction";

export const memoize = async (fn, name) => {
  const cachedData = localStorage.getItem(name);
  if (cachedData) {
    try {
      return { data: decryptData(cachedData), response: true };
    } catch (e) {
      console.error("Failed to decrypt data", e);
    }
  }

  const result = await fn();
  
  return result;
};

export const getProducts = async () => {
  try {
    const res = await axios.get(getProductsApi);
    if (res.status === 200) {
      localStorage.setItem('products', encryptData(res.data));
      return { data: res.data, response: true };
    }
  } catch (e) {
    return { data: e, response: false };
  }
};

export const getBrands = async () => {
  try {
    const res = await axios.get(getBrandsApi);
    if (res.status === 200) {
      return { data: res.data, response: true };
    }
  } catch (e) {
    return { data: e, response: false };
  }
};

export const getCategories = async () => {
  try {
    const res = await axios.get(categoryApi);
    if (res.status === 200) {
      console.log(res.data);
      return { data: res.data, response: true };
    }
  } catch (e) {
    return { data: e, response: false };
  }
};

export const getSubCategoriesProduct = async () => {

  try {
    const res = await axios.get(`${getProductbySubCategory}/${subCategory}`);
    if (res.status === 200) {
      localStorage.setItem("subCategories", encryptData(res.data));
      return { data: res.data, response: true };
    }
  } catch (error) {
    return { data: error, response: false };
  }
};

export const getUnits = async () => {
  try {
    const res = await axios.get(getUnitApi);
    if (res.status === 200) {
      return { data: res.data, response: true };
    }
  } catch (error) {
    return { data: error, response: false };
  }
};
