'use client'
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import userAuthReducer from '@/Redux/Reducers/userAuthReducer';
import productReducer from '@/Redux/Reducers/productReducers';
import orderReducers from '@/Redux/Reducers/orderReducers';



const rootReducer = combineReducers({
  products: productReducer,
  auth: userAuthReducer,
  orders: orderReducers,

});

const store = configureStore({
  reducer: rootReducer,
 
});

export default store;
