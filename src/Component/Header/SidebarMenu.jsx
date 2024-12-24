import React, { useState, useContext, useEffect } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import Link from "next/link";
import { GrUserAdmin } from "react-icons/gr";
import { AdminMenu, sideBarData } from "@/constants";
import UserContext from "@/userContext";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { whosVisiting } from "@/Context/functions";
import { decryptData } from "@/Context/userFunction";

const SidebarMenu = ({ collapse }) => {

  const router = useRouter();
  const {setToken, setUser, user} = useContext(UserContext)

  const handleSignOut = () => {
    try {
      localStorage.removeItem("gfToken");
      localStorage.removeItem("gfuser");
      setUser(null);
      setToken(null);
      router.push('/Authentication');
    } catch (e) {
      console.error(e);
    }
  };
  let token;

  useEffect(() => {
    const user = decryptData(localStorage.getItem("user"));
    setUser(user);
    const tokenData = decryptData(localStorage.getItem("token"));
    token = tokenData;
  }, []);

  return (
    <Sidebar
      className="z-[500] h-full bg-gray-100 scrollbar"
      collapsed={collapse}
    >
      <Menu className="">
        <div className="mt-4">
          {sideBarData.map((item, index) => (
            <>
              <MenuItem>
                <span
                  // href={`${item.path}`}
                  onClick={() => router.push(`${item.path}`)}
                  className="flex gap-4 px-2 rounded-md py-1"
                >
                  <span className="mt-1 txt-1 text-lg">{item.icon}</span>
                  <span className="txt-1">{item.name}</span>
                </span>
              </MenuItem>
            </>
          ))}
        </div>
        <div>
          {(user && user?.user?.userType === "Admin") ||
            (user?.user?.userType === "Vendor" && (
              <SubMenu
                label="Admin"
                icon={<GrUserAdmin />}
                className="txt-1 flex flex-col justify-center "
              >
                {AdminMenu.map((item, index) => (
                  <MenuItem key={index}>
                    <span
                      onClick={() => router.push(`${item.path}`)}
                      className="flex gap-4 px-2 rounded-md"
                    >
                      <span className="mt-1 txt-1 text-lg">{item.icon}</span>
                      <span className="txt-1">{item.name}</span>
                    </span>
                  </MenuItem>
                ))}
              </SubMenu>
            ))}

          {user ? (
            <MenuItem>
              <span
                className="flex  gap-4 txt-1 rounded-md"
                onClick={handleSignOut}
              >
                <span>
                <FaUser className="mt-1 ml-2" />
                </span>
                <span>Log Out</span>{" "}
              </span>
            </MenuItem>
          ) : (
            <MenuItem>
              <span
                className="flex  gap-4 txt-1 rounded-md"
                onClick={() => router.push("/auth")}
              >
                <span>
                  {" "}
                  <FaUser className="mt-1 ml-2" />
                </span>{" "}
                <span>Log In</span>
              </span>
            </MenuItem>
          )}
        </div>
      </Menu>
    </Sidebar>
  );
};

export default SidebarMenu;
