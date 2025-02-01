"use client";
import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("gfuser");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
   
        setUser(parsedUser);

        const storedToken = localStorage.getItem("gfToken");
        if (storedToken) {
          setToken(storedToken);
        }
      }
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, token, setToken, searchInput, setSearchInput }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
