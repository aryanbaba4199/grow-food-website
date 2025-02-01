import { encryptData } from "@/Context/userFunction";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAIL,
} from "@/Redux/actions/userAuthAction";


const initialState = {
  token: null,
  isAuthenticated: false,
  user: null,
};

function getInitialStateFromLocalStorage() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const isAuthenticated = token ? true : false;
    return {
      token,
      isAuthenticated,
      user: null,
    };
  }
  return initialState;
}

const initialAuthState = getInitialStateFromLocalStorage();

const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem('token', encryptData(action.payload));
      return {
        ...state,
        token: action.payload,
        isAuthenticated: true,
      };
    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
      };
    case FETCH_USER_SUCCESS:
      localStorage.setItem('user', encryptData(action.payload));
      return {
        ...state,
        user: action.payload,
      };
    case FETCH_USER_FAIL:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;
