import axios from "axios";
import { usersAPi } from "@/Api";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";
export const LOGOUT = "LOGOUT";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const FETCH_USER_FAIL = "FETCH_USER_FAIL";

const API_URL = usersAPi;


export const login = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    dispatch({ type: LOGIN_SUCCESS, payload: token });
    dispatch({ type: FETCH_USER_SUCCESS, payload: user });
    
  } catch (error) {
    console.error("Login error:", error);
    dispatch({ type: LOGIN_FAIL });
   
  }
};

export const register = (userData) => async (dispatch) => {
  try {
    await axios.post(`${API_URL}/register`, userData);
    dispatch({ type: REGISTER_SUCCESS });
    alert("User registered successfully");
  } catch (error) {
    console.error("Registration error:", error);
    dispatch({ type: REGISTER_FAIL });
    alert("Registration failed");
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem('user')
  localStorage.removeItem('userAddress');
  dispatch({ type: LOGOUT });
};

// export const fetchUserDetails = () => async (dispatch) => {
//   try {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const response = await axios.get(`${API_URL}/me`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       dispatch({ type: FETCH_USER_SUCCESS, payload: response.data });
//     }
//   } catch (error) {
//     console.error("Failed to fetch user details:", error);
//     dispatch({ type: FETCH_USER_FAIL });
//   }
// };

