import React, { useState, useContext, useEffect } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { FaStar, FaRupeeSign, FaEdit } from "react-icons/fa";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  IconButton,
  Button,
  Dialog,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import UserContext from "@/userContext";
import Checkout from "../Checkout/checkout";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import axios from "axios";
import { cartApi, createCartApi } from "@/Api";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { decryptData } from "@/Context/userFunction";
import Loader from "../helpers/loader";
import EditProducts from "../Admin/products/EditProducts";

const Details = ({ productData }) => {
  const [checkoutProduct, setCheckoutProduct] = useState([]);
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState(null); // Start with null or undefined
  const [qty, setQty] = useState(0);
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const router = useRouter();
  const { token, user, searchInput } = useContext(UserContext);

  useEffect(() => {
    if (productData) {
      setProduct({ ...productData });
      setQty(productData.minimumOrderQty ? productData.minimumOrderQty : 1);
    }
  }, [productData]);

  useEffect(() => {
    if (searchInput !== "") {
      const storedProducts = localStorage.getItem("products");
      const decryptedProducts = storedProducts
        ? decryptData(storedProducts)
        : [];

      // Find the first product that matches the search input (case-insensitive)
      const searchedProduct = decryptedProducts.find((item) =>
        item.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setProduct(searchedProduct || {});
    }
  }, [searchInput]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const handleCart = async () => {
    if (token !== "") {
      const formData = {
        userId: user._id,
        productId: product._id,
        qty: qty,
      };
      console.log(formData);
      try {
        const res = await axios.post(createCartApi, formData);
        if (res.status === 200) {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Added to Cart Successfully...",
            showClass: {
              popup: "true",
            },
          });
        }
      } catch (e) {
        console.error(e);
        Swal.fire({
          title: "Failed",
          icon: "error",
          text: e.message,
          position: "top-end",
        });
      }
    } else {
      Swal.fire({
        title: "Log in Required",
        icon: "warning",
        text: "Log in required for handling cart details",
        confirmButtonText: "Log in ",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Authentication");
        }
      });
    }
  };

  const handleBuyNow = () => {
    if (token !== "") {
      setCheckoutProduct([product]);
      setEmail(user?.email);
      console.log('email is ', user?.email);
      localStorage.setItem("products", JSON.stringify([product]));
      localStorage.setItem("qty", JSON.stringify([qty]));
      localStorage.setItem("route", "buy");
      router.push("/checkout");
    } else {
      Swal.fire({
        title: "Log in Required",
        icon: "warning",
        text: "Log in required to provide you the best services...",
        confirmButtonText: "Log in ",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/auth");
        }
      });
    }
  };

  const handleDecrement = () => {
    if (qty <= product.minimumOrderQty) {
      Swal.fire(`Minimum Order Quantity is : ${qty}`);
      setQty(product.minimumOrderQty);
    } else {
      setQty(qty - (product.incDecBy !== undefined ? product.incDecBy : 1));
    }
  };

  const handleIncrement = () => {
    if (qty > product.availableQty) {
      Swal.fire(`Minimum Order Quantity is : ${qty}`);
    } else {
      setQty(qty + (product.incDecBy !== undefined ? product.incDecBy : 1));
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
  };

  return (
    <>
      {product === null ? (
        <Loader />
      ) : (
        <div>
          <div className="flex flex-col md:flex-row justify-between  mt-8 px-4 gap-8 md:mb-0 mb-8">
            <div className="absolute ml-[40rem] mt-4">
              {user &&
                (user._id === product.vendorId ||
                  user?.userType === "admin") && (
                  <FaEdit
                    onClick={() => handleEdit(product)}
                    className="text-[#15892e] text-xl hover:cursor-pointer"
                  />
                )}
            </div>
            <div className="flex flex-col items-center w-full md:w-[45%]">
              <Carousel
                className="w-full h-auto"
                swipeable={true}
                draggable={true}
                showDots={true}
                responsive={responsive}
                ssr={true} // means to render carousel on server-side.
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={3000}
                keyBoardControl={true}
                arrows={false}
                transitionDuration={700}
                dotListClass="custom-dot-list-style"
              >
                {(product?.image?.length === 0
                  ? [
                      "https://www.nbu.ac.in/img/dept/anthropology/slider/slider3.jpg",
                    ]
                  : product.image
                ).map((imageUri, index) => (
                  <div key={index} className="w-full">
                    <img
                      src={
                        imageUri
                          ? imageUri
                          : "https://www.nbu.ac.in/img/dept/anthropology/slider/slider3.jpg"
                      }
                      alt={`Product Image ${index + 1}`}
                      className="w-full h-96 rounded-md"
                    />
                  </div>
                ))}
              </Carousel>

              <div className="flex gap-4 text-xl border border-gray-300 px-4 py-1 justify-between items-center mt-2 shadow-md rounded-2xl">
                <Tooltip title="Decrease Quantity">
                  <IconButton
                    onClick={handleDecrement}
                    size="small"
                    color="inherit"
                  >
                    <FaCircleMinus />
                  </IconButton>
                </Tooltip>
                <span>{qty ?? product.minimumOrderQty ?? 1}</span>
                <Tooltip title="Increase Quantity">
                  <IconButton
                    onClick={handleIncrement}
                    size="small"
                    color="success"
                  >
                    <FaCirclePlus className="" />
                  </IconButton>
                </Tooltip>
              </div>
              <div className="mt-4 z-[200] w-full flex gap-2 justify-center md:relative fixed bottom-0 items-center">
                <Button
                  onClick={handleCart}
                  variant="contained"
                  disabled={product.display === false}
                  color="warning"
                  className="w-[50%]"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={product.display === false}
                  variant="contained"
                  color="success"
                  className="w-[50%]"
                >
                  Buy Now
                </Button>
              </div>
            </div>
            <div className="flex flex-col w-full md:w-[45%] px-4 md:px-8">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <div className="flex items-center mt-2">
                <span>Rating:</span>
                <div className="flex text-yellow-500 ml-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
              <div className="mt-4 mb-16">
                <div className="flex items-center">
                  <span className="line-through text-gray-500 ml-4">
                    {product.price}
                  </span>
                  <span className="text-green-700 font-bold ml-4">
                    {product.discount}% off
                  </span>
                  <div className="flex ml-4 justify-center items-center bg-color-1 px-4 rounded-md">
                    <FaRupeeSign className="mt-[2px]" />
                    <span className="text-xl font-bold ml-1">
                      {product.sellingPrice ?? 100}
                    </span>
                  </div>
                </div>

                <Table className="mt-4 border border-gray-300 rounded-lg ">
                  <TableBody>
                    {product.display === false && (
                      <TableRow className="bg-red-100">
                        <TableCell colSpan={2} className="text-center py-3">
                          <span className="text-red-600 font-semibold text-lg">
                            Out of Stock
                          </span>
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow className="hover:bg-gray-50 border-t">
                      <TableCell className="py-3 px-4 font-semibold text-black">
                        <p className="text-[1rem] font-semibold">
                          Total Payable{" "}
                        </p>
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 font-bold ${
                          product.sellingPrice * qty > 2000
                            ? "text-green-700"
                            : "text-red-600"
                        }`}
                      >
                        {parseInt(product.sellingPrice * qty)}/-
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-50 border-t">
                      <TableCell className="py-3 px-4 font-semibold text-black">
                        <p className="text-[1rem] font-semibold">Brand </p>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        {product.brand}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-50 border-t">
                      <TableCell className="py-3 px-4 font-semibold text-black">
                        <p className="text-[1rem] font-semibold">Category</p>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        {product.categories}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-50 border-t">
                      <TableCell className="py-3 px-4 font-semibold text-black">
                        <p className="text-[1rem] font-semibold">
                          Sub Category
                        </p>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        {product.subCategory}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-50 border-t">
                      <TableCell className="py-3 px-4 font-semibold text-black">
                        <p className="text-[1rem] font-semibold">Packet size</p>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        {product.productQty} {product.unit}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-50 border-t">
                      <TableCell className="py-3 px-4 font-semibold text-black">
                        <p className="text-[1rem] font-semibold">
                          Minimum Order
                        </p>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        {product.minimumOrderQty}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-50 border-t">
                      <TableCell className="py-3 px-4 font-semibold text-black">
                        Food Type:
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        {product.foodPrefence}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-50 border-t">
                      <TableCell className="py-3 px-4 font-semibold text-black">
                        Life:
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        {product.life}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <div className="px-8 flex items-center gap-4">
            <Typography
              color="#1f2937"
              fontFamily={"revert"}
              className="gray-800"
              fontWeight={600}
            >
              {product.description}
            </Typography>
          </div>
        </div>
      )}
      <Dialog
        open={open}
        fullWidth
        maxWidth="lg"
        onClose={() => setOpen(false)}
        fullScreen
      >
        <Checkout
          products={checkoutProduct}
          qty={[qty]}
          maxWidth="lg"
          // fullScreen={isSmallScreen}
          // PaperProps={{
          //   style: { width: isSmallScreen ? "100%" : "80%", height: "100vh" },
          // }}
          open={open}
          uid={user?._id}
          setCopen={setOpen}
          // setOpen={setOpen}
        />
      </Dialog>
      <Dialog open={editProduct !== null} onClose={() => setEditProduct(null)}>
        <EditProducts product={editProduct} setEditMode={setEditProduct} />
      </Dialog>
    </>
  );
};

export default Details;
