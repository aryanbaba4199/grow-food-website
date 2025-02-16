import axios from "axios";

// const apiurl = 'http://localhost:5000'
const apiurl = 'https://growfoodapi-1032443967847.asia-south1.run.app'

export const API_URL = apiurl;
export const logo_uri = 'https://i.pinimg.com/736x/5d/90/4b/5d904b9f3b2f1a21c7ef3d19729598a3.jpg'


// -------------Users Api --------------------
export const registerApi = `${apiurl}/api/users/register`
export const userlogin = `${API_URL}/api/users/login`;
export const usersAPi = `${apiurl}/api/users`
export const getUserApi = `${apiurl}/api/users`
export const forgotPasswordApi = `${apiurl}/api/users/forgotPassword`
export const authApi = {
    forgot : `${apiurl}/api/users/forgotPassword`,
    verifyOtp : `${apiurl}/api/users/verifyOtp`,
    resetPassword : `${apiurl}/api/users/resetPassword`,
}

export const getDeliveryAddress = `${apiurl}/api/users/getDeliveryAddress`
export const updateUserDetails = `${apiurl}/api/users/updateUser`
export const createAddress = `${apiurl}/api/users/createAddress`
export const getuserAddress = `${apiurl}/api/users/getAddress`
export const getAllUsers = `${apiurl}/api/users/getallusersforadmin`
export const deleteAddressApi = `${apiurl}/api/users/deleteAddress`

 

// -------Orders API --------------------------------
export const OrdersApi = `${apiurl}/api/orders`
export const createOrderAPI = `${apiurl}/api/orders/create`
export const getOrdersByUser = `${apiurl}/api/orders/getOrders`
export const getOrderApi = `${apiurl}/api/orders/getOrder`
export const updateOrderbyId = `${apiurl}/api/orders/updateOrder`
export const deleteOrderbyId = `${apiurl}/api/orders/deleteOrder`



// -------------Carts API --------------------------------
export const cartApi = `${apiurl}/api/orders/getCart`
export const createCartApi = `${apiurl}/api/orders/createCart`
export const deleteCartItem = `${apiurl}/api/orders/deleteCart`




// ---------------Products Api ---------------------------
export const productsAPi = `${apiurl}/api/products/getAllProducts`
export const getProductbyId = `${apiurl}/api/products/product`
export const createProduct = `${apiurl}/api/products`
export const getProductsApi = `${apiurl}/api/products`
export const updateProductsApi = `${apiurl}/api/products/updateProduct`
export const deleteProductApi = `${apiurl}/api/products?id=`
export const getBrandsProductApi = `${apiurl}/api/products/brandsProduct`
export const getCategoriesProductApi = `${apiurl}/api/products/categoriesProduct`
export const searchProductsApi = `${apiurl}/api/products/search/searchInDatabase`
export const bulkUploadApi = `${apiurl}/api/products/products/bulkCreate`



// ---------------Brands Api ---------------------------
export const updateBrandbyId = `${apiurl}/api/products/updateBrand`
export const deleteBrandbyId = `${apiurl}/api/products/deleteBrand`
export const getBrandsApi = `${apiurl}/api/products/brands`
export const createUnit = `${apiurl}/api/products/createUnit`
export const getUnitApi = `${apiurl}/api/products/getUnit`

export const getProductbySubCategory = `${apiurl}/api/products/subProduct`


export const subCategoryAPI = `/api/products/subCategory`

//------------Categories------------
export const categoryApi = `${apiurl}/api/products/category`
export const getSubCategoriesApi = `${apiurl}/api/products/getSubCategory`
export const createSubCategory = `${apiurl}/api/products/createSubCategory`


//vendors Api

export const vendorApi  = {
    orders : `${apiurl}/api/vendors/orders`,
    products : `${apiurl}/api/vendors/products`,
    displayProducts : `${apiurl}/api/vendors/displayProducts`,
    updateOrder : `${apiurl}/api/vendors/updateOrder`,
}


// Admin API

export const adminOrders = `${apiurl}/api/admin/orders`
export const vendorProducts = `${apiurl}/api/admin/products`




export const getterFunction = async(uri)=>{
    console.log('uri', uri);
    try{
        const res = await axios.get(uri)
    return res.data;
    }catch(err){
        console.error(err);
        throw err;
    }
    
}

export const updaterFunction =async(uri, data)=>{
    try{
        const res = await axios.put(uri, data)
        return res.data;
    }catch(err){
        console.error(err);
        throw err;
    }
}

export const DeleteApi = async(uri)=>{
    try{
        const res = await axios.delete(uri)
        return res.data;
    }catch(err){
        console.error(err);
        throw err;
    }
   
}

export const posterFunction = async(uri, formData)=>{
    try{
       const res = await axios.post(uri, formData) 
       return res.data;
    }catch(err){
        console.error(err);
        throw err;
    }
}


