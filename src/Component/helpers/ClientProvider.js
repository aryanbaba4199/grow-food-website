// src/app/ClientProvider.jsx
"use client";

import { Provider } from "react-redux";
import store from "@/Redux/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCategories } from "@/Redux/actions/productActions";
import { getBrands } from "@/Redux/actions/productActions";
import { getProducts} from "@/Redux/actions/productActions";
import { UserProvider } from "@/userContext";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";



function ReduxInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBrands())
    dispatch(getProducts())
    dispatch(getCategories())
  }, [dispatch]);

  return children;
}

export default function ClientProvider({ children }) {
  return (
    <UserProvider>
    <Provider store={store}>
      <Header/>
      <ReduxInitializer>
     
        {children}
       
        </ReduxInitializer>
        <Footer/>
    </Provider>
    </UserProvider>
  );
}
