import axios from "axios";

// const apiurl = 'http://localhost:5000'
const apiurl = 'https://growfoodapi.onrender.com'

export const API_URL = apiurl;
export const logo_uri = 'https://i.pinimg.com/736x/5d/90/4b/5d904b9f3b2f1a21c7ef3d19729598a3.jpg'


// -------------Users Api --------------------
export const userAPI = `/api/users`
export const userlogin = `${API_URL}/api/users/login`;
export const usersAPi = `${apiurl}/api/users`
export const getUserApi = `${apiurl}/api/users`

export const getDeliveryAddress = `${apiurl}/api/users/getDeliveryAddress`
export const updateUserDetails = `${apiurl}/api/users/updateUser`
export const createAddress = `/api/userAddress`
export const getuserAddress = `/api/userAddress`
export const getAllUsers = `${apiurl}/api/users/getallusersforadmin`

 

// -------Orders API --------------------------------
export const OrdersApi = `${apiurl}/api/orders`
export const createOrderAPI = `/api/orders`
export const getOrdersByUser = `/api/orders?id=`
export const updateOrderbyId = `${apiurl}/api/orders/updateOrder`
export const deleteOrderbyId = `/api/orders/?id=`



// -------------Carts API --------------------------------
export const cartApi = `/api/cart`
export const deleteCartItem = `/api/cart?id=`




// ---------------Products Api ---------------------------
export const productsAPi = `/api/products`
export const getProductbyId = `/api/products?id=`
export const createProduct = `/api/products`
export const getProductsApi = `/api/products`


// ---------------Brands Api ---------------------------
export const updateBrandbyId = `/api/brands?id=`
export const deleteBrandbyId = `/api/brands?id=`
export const getBrandsApi = `/api/brands`

export const createUnit = `/api/unit`
export const getUnitApi = `/api/unit`

export const getProductbySubCategory = `${apiurl}/api/products/subProduct`


export const subCategoryAPI = `/api/subCategory`

//------------Categories------------
export const categoryApi = '/api/category'
export const getSubCategoriesApi = `/api/subCategory`
export const createSubCategory = `/api/subCategory`





export const getterFunction = async(uri)=>{
    try{
        const res = await axios.get(uri)
    return res.data;
    }catch(err){
        console.error(err);
        throw err;
    }
    
}


