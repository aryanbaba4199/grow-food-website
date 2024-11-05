import React, { useEffect, useState, useContext } from "react";
import { getuserAddress, createOrderAPI } from "@/Api";
import UserContext from "@/userContext";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Dialog,
} from "@mui/material";
import { IoIosCreate } from "react-icons/io";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { IoMdCloseCircle } from "react-icons/io";
import axios from "axios";
import { FaCheckDouble } from "react-icons/fa";
import { decryptData } from "@/Context/userFunction";
import AddressForm from "../user/AddressForm";

const Checkout = ({
  products,
  qty, // Array of quantities
  setCopen,
  deleteCart,
}) => {
  const [address, setAddress] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [calculatedPrices, setCalculatedPrices] = useState([]);
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [addressMode, setAdddremode] = useState(false);

  useEffect(() => {
    
    fetchAddress();
  }, [addressMode]);

  const fetchAddress = async () => { 
    try {
      const res = await axios.get(
        `${getuserAddress}?id=${user?._id}`
      );
      if (res.status === 200) {
        setAddress(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (products.length > 0 && qty.length > 0) {
      const newCalculatedPrices = products.map((item, index) => {
        const quantity = qty[index]; // Corresponding quantity for the product
        const totalPrice = quantity * item.sellingPrice;
        return { productId: item._id, quantity, totalPrice };
      });
      setCalculatedPrices(newCalculatedPrices);
      validatePrice();
    }
  }, [products, qty]);


 

  const handleCheckOut = async () => {
    if (!addressId) {
      Swal.fire({
        title: "Addresses",
        icon: "warning",
        text: "Please select an address",
      });
      return;
    }
    console.log("Addresseid", addressId);

    const formData = calculatedPrices.map((item, index) => ({
      productId: item.productId,
      vendorId: products.find((pr) => pr._id === item.productId)?.vendorId,
      userId: user._id,
      addressId,
      quantity: item.quantity,
      paymentId: "na",
      paymentMode: "COD",
      orderAmount: item.totalPrice,
      quantity: qty[index],
    }));


    try {
      const res = await axios.post(createOrderAPI, formData);
      if (res.status === 200) {
        Swal.fire("Success", "Order Created Successfully", "success");

        setCopen(false);
        router.push("/");
        if (deleteCart) {
          for (const item of orderDetails) {
            await deleteCart(item.productId);
          }
        }
      }
    } catch (e) {
      Swal.fire("Error", e.message, "error");
    }
  };

  const totalPayable = calculatedPrices.reduce(
    (acc, item) => acc + item.totalPrice,
    0
  );

  const validatePrice = () => {
    if (totalPayable === 0) {
      return;
    } else {
      if (parseInt(totalPayable) < 2000) {
        Swal.fire({
          title: "Minimum Order: 2000/-",
          icon: "info",
          text: `You have to create an order amount of a minimum of 2000/- currently: ${totalPayable}`,
        });
        setCopen(false);
      }
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 mt-4">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card className="shadow-lg">
              <CardContent>
                <Typography
                  variant="h6"
                  className="bg-color-1 flex justify-between text-white px-4 py-2 rounded-md"
                >
                  <span>Delivery Address</span>
                  <span
                    className="text-xl bg-white px-2 rounded-full text-red-500 hover:cursor-pointer"
                    onClick={() => setCopen(false)}
                  >
                    X
                  </span>
                </Typography>

                <div className="mt-4">
                  {address.length > 0 ? (
                    address.map((item) => (
                      <div
                        key={item._id}
                        className={`border p-4 mb-2 rounded-md cursor-pointer ${
                          addressId === item._id
                            ? "border-green-600"
                            : "border-gray-300"
                        }`}
                        onClick={() => setAddressId(item._id)}
                      >
                        <span>Name: {item.name}</span>
                        <div className="flex justify-between items-center">
                          <span>{item.mobile}</span>
                          {addressId === item._id && (
                            <FaCheckDouble className="text-green-600" />
                          )}
                        </div>
                        <div className="text-sm text-gray-700">
                          {item.landmark}, {item.locality}, {item.city},{" "}
                          {item.state} - {item.zip}
                        </div>
                      </div>
                    ))
                  ) : (
                    <Typography>Address not found</Typography>

                  )}
                </div>
                <div className="flex justify-end items-center">
                  <Button onClick={()=>setAdddremode(!addressMode)} variant="outlined">
                  <IoIosCreate className="mr-2 text-xl"/>
                <Typography>
                  Create Address
                </Typography>
                </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="shadow-lg">
              <CardContent>
                <Typography
                  variant="h6"
                  className="bg-color-1 text-white px-4 py-2 rounded-md"
                >
                  Product Details
                </Typography>
                <Table className="mt-4">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>Product Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Quantity</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Rate</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Total</strong>
                      </TableCell>
                    </TableRow>
                    {calculatedPrices.map((item) => {
                      const product = products.find(
                        (prod) => prod._id === item.productId
                      );
                      return (
                        <TableRow key={item.productId}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{product.sellingPrice}</TableCell>
                          <TableCell>{item.totalPrice}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="mt-4 text-right">
                  <Typography variant="h6">
                    Total Payable: {totalPayable}/-
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleCheckOut}
            className="bg-color-1 text-white px-4 py-2 rounded-md font-semibold"
          >
            Checkout
          </button>
        </div>
      </div>
      <Dialog open={addressMode} onClose={()=>setAdddremode(false)}>
          <AddressForm setAddressMode={setAdddremode} />
      </Dialog>
    </>
  );
};

export default Checkout;
