import { BiSolidCategory, BiSpa } from "react-icons/bi";
import { FaHome, FaUser } from "react-icons/fa";
import { FaCartPlus, FaDatabase } from "react-icons/fa6";
import { GrUserAdmin } from "react-icons/gr";
import { MdDonutSmall } from "react-icons/md";
import { SiBrandfolder, SiGooglecontaineroptimizedos, SiProducthunt } from "react-icons/si";

export const sideBarData = [
    {
        icon : <FaHome/>, 
        name : 'Home', 
        path : "/"
    },
    {
        icon : <FaDatabase/>, 
        name : "Products", 
        path : "/products" 
    },
    {
        icon : <FaCartPlus/>,
        name : "Cart", 
        path : "/cart" , 
    },
    {
        icon : <SiGooglecontaineroptimizedos/>, 
        name : "Orders", 
        path : "/orders", 
    },
    

]

export const AdminMenu = [
    {
        icon : <GrUserAdmin/>,
        name : "Dashboard",
        path : "/admin/dashboard"
    },
    {
        icon : <FaDatabase/>, 
        name : "Orders", 
        path : "/admin/orders",
    }, 
    
    {
        icon : <FaUser/>, 
        name : "Users",
        path : "/admin/users",
    },
    {
        icon : <SiProducthunt/>,
        name : "Products",
        path : "/admin/products",
    },
    {
        icon : <BiSolidCategory/>, 
        name : "Categories",
        path : "/admin/category",
    }, 
    {
        icon : <SiBrandfolder/>, 
        name : "Brands",
        path : "/admin/brands",
    },
]