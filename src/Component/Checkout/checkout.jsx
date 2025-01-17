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
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { FaCheckDouble } from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";
import AddressForm from "../user/AddressForm";
import axios from "axios";

const Checkout = ({ products, qty, setQty, deleteCart }) => {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState([]);
  const [addressId, setAddressId] = useState(null);
  const [addressMode, setAddressMode] = useState(false);
  const [calculatedPrices, setCalculatedPrices] = useState([]);
  const [totalPayable, setTotalPayable] = useState(0); // Ensure totalPayable is defined
  const router = useRouter();
  const { user } = useContext(UserContext);

  

  useEffect(() => {
    if (user) {
      fetchAddress();
    }
  }, [user, addressMode]);

  useEffect(() => {
    if (products?.length > 0 && qty?.length > 0) {
      const newCalculatedPrices = products.map((item, index) => {
        const quantity = qty[index];
        const totalPrice = quantity * item.sellingPrice;
        return { productId: item._id, quantity, totalPrice, image: item.image, vendorId: item.vendorId };
      });
      setCalculatedPrices(newCalculatedPrices);

      // Calculate the totalPayable
      const totalAmount = newCalculatedPrices.reduce(
        (acc, item) => acc + item.totalPrice,
        0
      );
      setTotalPayable(totalAmount);
    }
  }, [products, qty]);

  const fetchAddress = async () => {
    try {
      const res = await axios.get(`${getuserAddress}/${user._id}`);
      if (res.status === 200) {
        setAddress(res.data);
        setAddressId(res?.data[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckOut = async () => {
    if (!addressId) {
      Swal.fire({
        title: "Addresses",
        icon: "warning",
        text: "Please select an address",
      });
      return;
    }

    if (totalPayable <= 2000) {
      Swal.fire({
        title: "Low Order Amount",
        text: "Order Amount cannot be less than 2000",
        icon: "info",
      });
      return;
    }

    const orderDetails = {
      userId: user._id,
      paymentMode: "COD", // As COD is selected
      addressId,
      billAmount: totalPayable,
      productsArray: calculatedPrices.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        images: item.image[0],
        vendorId: item.vendorId,
      })),
      date: new Date(),
    };

    console.log(calculatedPrices);

    try {
      const res = await axios.post(createOrderAPI, { formData: orderDetails });
      if (res.status === 200) {
        Swal.fire("Success", "Order Created Successfully", "success");

        if (deleteCart) {
          for (const item of orderDetails.productsArray) {
            await deleteCart(item.productId);
          }
        }

        // Redirect to a confirmation page or back to cart
        router.push("/order-confirmation"); // Modify this route as needed
      }
    } catch (e) {
      Swal.fire("Error", e.message, "error");
    }
  };

  const handleCreateAddress = async () => {
    setAddressMode(true);
  };

  return (
    <>
      <div className="container mx-auto p-4 mt-4">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card className="shadow-lg">
              <CardContent>
                <p
                  onClick={() => setOpen(!open)}
                  variant="h6"
                  className="bg-slate-900 hover:cursor-pointer flex justify-start gap-4 items-center text-white px-4 py-2 rounded-md"
                >
                  <FaLocationPin className="bg-gray-100 text-lime-500 w-8 h-8 p-1 rounded-full" />
                  <span>Change Address</span>
                </p>
                {open && (
                  <div className="mt-4">
                    {address.length > 0 ? (
                      address.map((item) => (
                        <div
                          key={item._id}
                          className={`border p-4 mb-2 rounded-md cursor-pointer ${addressId === item._id ? "border-green-600" : "border-gray-300"}`}
                          onClick={() => {
                            setAddressId(item);
                            setOpen(false);
                          }}
                        >
                          <span>Name: {item.name}</span>
                          <div className="flex justify-between items-center">
                            <span>{item.mobile}</span>
                            {addressId === item._id && (
                              <FaCheckDouble className="text-green-600" />
                            )}
                          </div>
                          <div className="text-sm text-gray-700">
                            {item.landmark}, {item.locality}, {item.city}, {item.state} - {item.zip}
                          </div>
                        </div>
                      ))
                    ) : (
                      <Typography>Loading address...</Typography>
                    )}
                  </div>
                )}
                {addressId !== null && address.length !== 0 && (
                  <div className="border p-4 mb-2 rounded-md cursor-pointer">
                    <span>Name: {addressId?.name}</span>
                    <div className="flex justify-between items-center">
                      <span>{addressId?.mobile}</span>
                      <FaCheckDouble className="text-green-600" />
                    </div>
                    <div className="text-sm text-gray-700">
                      {addressId?.landmark}, {addressId?.locality}, {addressId?.city}, {addressId?.state} - {addressId?.zip}
                    </div>
                  </div>
                )}
                {address.length === 0 && (
                  <div className="flex justify-center items-center mt-8">
                    <span
                      className="px-4 py-2 bg-gradient-to-r from-[#15892e] rounded-md hover:cursor-pointer to-yellow-600 text-white"
                      onClick={() => handleCreateAddress()}
                    >
                      Create New Address
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="mt-4">
              <div className="p-4">
                <p className="text-xl font-semibold bg-slate-900 text-white p-2 rounded-md">
                  Select Payment Method
                </p>
                <div className="mt-8 flex justify-evenly items-center">
                  <p className="p-2 bg-color-1 rounded-md font-semibold hover:cursor-pointer">
                    Cash On Delivery
                  </p>
                  <p
                    className="bg-gray-400 p-2 px-4 rounded-md text-white hover:cursor-pointer"
                    onClick={() => {
                      Swal.fire({
                        title: "Coming Soon",
                        text: "Online payment coming soon",
                        icon: "info",
                      });
                    }}
                  >
                    Online
                  </p>
                </div>
              </div>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="shadow-lg">
              <CardContent>
                <Typography variant="h6" className="bg-slate-900 text-white px-4 py-2 rounded-md">
                  Product Details
                </Typography>
                <Table className="mt-4">
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Product Name</strong></TableCell>
                      <TableCell className="flex justify-center items-center gap-1"><strong>Quantity</strong></TableCell>
                      <TableCell><strong>Rate</strong></TableCell>
                      <TableCell><strong>Total</strong></TableCell>
                    </TableRow>
                    {calculatedPrices.map((item, index) => {
                      const product = products.find(prod => prod._id === item.productId);
                      return (
                        <TableRow key={item.productId}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell className="flex justify-center gap-4">
                            {item.quantity}
                            <p
                              onClick={() => {
                                const updatedQty = [...qty];
                                updatedQty[index] = Number(updatedQty[index]) + 1;
                                setQty(updatedQty);
                              }}
                              className="bg-color-1 text-white px-4 py-2 rounded-md active:bg-cyan-600 transition font-semibold cursor-pointer"
                            >
                              Add
                            </p>
                          </TableCell>
                          <TableCell>{product.sellingPrice}</TableCell>
                          <TableCell>{item.totalPrice.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="mt-4 text-right">
                  <Typography variant="h6" className="font-semibold text-slate-900">
                    Total Payable : {totalPayable.toFixed(2)}/-
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

      <Dialog open={addressMode} onClose={() => setAddressMode(false)}>
        <AddressForm setAddressMode={setAddressMode} />
      </Dialog>
    </>
  );
};

export default Checkout;
