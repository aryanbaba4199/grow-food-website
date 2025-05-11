import axios from 'axios';
import { categoryApi, DeleteApi, getBrandsApi, getBrandsProductApi, getCategoriesApi, getCategoriesProductApi, getSubCategoriesApi, getSubCategoriesAPI, getterFunction, getUnitApi, posterFunction, productsAPi, updaterFunction } from '@/Api';
export const GET_PRODUCTS = 'GET_PRODUCTS';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const GET_PRODUCT = 'GET_PRODUCT';
export const GET_BRANDS = 'GET_BRANDS';
export const GET_CATEGORY = 'GET_CATEGORY';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const GET_UNIT = 'GET_UNIT';
export const GET_SUBCATEGORY = 'GET_SUBCATEGORY';
export const GET_CATEGORY_PRODUCT = 'GET_CATEGORY_PRODUCT';
export const GET_BRANDS_PRODUCT = 'GET_BRANDS_PRODUCT';



// Use the correct URL for React Native emulator
const API_URL = productsAPi;

export const getProducts = (page, address) => async dispatch => {
  try {
    const response = await axios.get(`${API_URL}/${page??1}`);
    dispatch({ type: GET_PRODUCTS, payload: response.data});

  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

export const getProduct = (id) => async (dispatch) => {
  try {
    const res = await getterFunction(`${API_URL}/product/${id}`);
    dispatch({ type: GET_PRODUCT, payload: res.data });
  } catch (error) {
    console.error('Error fetching product:', error);
  }
};

export const getBrandsProduct = (brand)=> async(dispatch)=>{
  try{
    const res = await getterFunction(`${getBrandsProductApi}/${brand}`)
    dispatch({type : 'GET_BRANDS_PRODUCT', payload: res.data});
  }catch(err){
    console.error('Error fetching brands product', err);
  }
}

export const getCategoriesProduct = (categories)=> async(dispatch)=>{
  try{
    const res = await getterFunction(`${getCategoriesProductApi}/${categories}`)
    dispatch({type : 'GET_CATEGORY_PRODUCT', payload: res.data});
  }catch(err){
    console.error('Error fetching brands product', err);
  }
}


// Getting Brands 
export const getBrands = () => async dispatch => {
  try{
  let brand = "brands";
  const response = await getterFunction(getBrandsApi);
  dispatch({type : GET_BRANDS, payload: response.data})
  }catch (error) {
    console.error('Error fetching Brands', error);
  }
};



// Getting Categories
export const getCategories = () => async dispatch => {
  try{
    let category = "category";
    const response = await getterFunction(categoryApi);
    dispatch({type : GET_CATEGORY, payload: response.data})
  }catch(err){
    console.error('Error fetching categories', err);
  }
};

export const getUnit = ()=>async dispatch =>{
  try{
    const res = await getterFunction(getUnitApi);
    dispatch({type : GET_UNIT, payload: res.data});
  }catch(err){
    console.error('Error fetching unit', err);
  };
}



export const getSubCategories = ()=>async dispatch =>{
  try{
    const res = await getterFunction(getSubCategoriesApi);
    dispatch({type : GET_SUBCATEGORY, payload: res.data})
  }catch(err){
    console.error('Error fetching', err);
  }
}




export const addProduct = (productData) => async dispatch => {
  try {
    const response = await posterFunction(API_URL, productData);
    dispatch({ type: ADD_PRODUCT, payload: response.data });
  } catch (error) {
    console.error('Error adding product:', error);
  }
};



export const updateProduct = (id, product) => async dispatch => {
  try {
    const response = await updaterFunction(`${API_URL}/${id}`, product);
    dispatch({ type: UPDATE_PRODUCT, payload: response.data });
  } catch (error) {
    console.error('Error updating product:', error);
  }
};

export const deleteProduct = id => async dispatch => {
  try {
    await DeleteApi(`${API_URL}/${id}`);
    dispatch({ type: DELETE_PRODUCT, payload: id });
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};


