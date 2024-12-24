import axios from "axios";
import { OrdersApi } from "@/Api";
export const CREATE_ORDER = "CREATE_ORDER";
export const FETCH_ORDER = "FETCH_ORDER";
export const FETCH_ORDERS = "FETCH_ORDERS";

const API_URL = OrdersApi;


export const createOrder = (order) => async dispatch => {
    try {

        const res = await axios.post(`${API_URL}/create`, { order });
        dispatch({ type: CREATE_ORDER, payload: res.data });
    } catch (e) {
        console.error("Error creating order", e);
    }
}

export const fetchOrder = (userId) => async dispatch => {
    try {
        const res = await axios.get(`${API_URL}/user/${userId}`);
        dispatch({ type: FETCH_ORDERS, payload: res.data });
    } catch (e) {
        console.error("Error fetching order", e);
    }
}

export const fetchOrders = () => async dispatch =>{
    try{
        const res = await axios.get(`${API_URL}/adminOrders`);
        dispatch({type : FETCH_ORDERS, payload: res.data })
    }catch (e) {
        console.error("Error fetching orders", e);
    };
}
