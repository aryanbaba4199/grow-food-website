import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button,
  Dialog,
  Paper,
} from "@mui/material";

import EditOrder from "./editOrder";
import Swal from "sweetalert2";
import axios from "axios";
import { deleteOrderbyId, getDeliveryAddress } from "@/Api";

import Loader from "@/Component/helpers/loader";
import { decryptData } from "@/Context/userFunction";

const OrderCard = ({ order, user }) => {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState([]);
  const [product, setProducts] = useState([]);

  useEffect(() => {
    if (order.productId) {
      getDeliveryAddres(order.addressId);
      const currUser = decryptData(localStorage.getItem("user"));
      if (
        currUser.user.userStatus === "Verified" &&
        currUser.user.userType === "Admin"
      ) {
        const productis = decryptData(localStorage.getItem("products")).find(
          (item) => item._id === order.productId
        );
        setProducts(productis);
      } else if (
        currUser.user.userStatus === "Verified" &&
        currUser.user.userType === "Vendor"
      ) {
        const productis = decryptData(localStorage.getItem("products")).find(
          (item) =>
            item._id === order.productId && currUser.user._id === order.vendorId
        );
        setProducts(productis);
      }
    }
  }, [order.productId]);

  const productis = decryptData(localStorage.getItem("products")).find(
    (item) => item._id === order.productId
  );


  // const handleOpen = () => {
  //   Swal.fire({
  //     title: "Do you want to save the changes?",
  //     showDenyButton: true,
  //     showCancelButton: true,
  //     confirmButtonText: "Update",
  //     denyButtonText: `Delete`
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       setOpen(true);
  //     } else if (result.isDenied) {
  //       Swal.fire({
  //         title : 'Confirm',
  //         icon: 'warning',
  //         text : 'Are you sure you want to Delete',
  //         showCancelButton : true,
  //         cancelButtonText : 'Cancel',
  //         showConfirmButton : true,
  //         confirmButtonText : 'Delete',
  //       }).then((result) => {
  //         if(result.isConfirmed){
  //           handleDelete();
  //         }else if(result.isDenied){
  //           setOpen(false);
  //         }
  //       });
  //     }
  //   });
  // };

  const handleUpdate = (updatedDetails) => {
    setOpen(false);
  };

  // const handleDelete = async() => {
  //   try{
  //     const res = await axios.delete(`${deleteOrderbyId}/${order._id}`);
  //     if(res.status === 200){
  //       Swal.fire({
  //         title: "Deleted",
  //         icon: "success",
  //         text : 'Order deleted successfully...'
  //       });
  //       dispatch(fetchOrders());
  //     }
  //   }catch(err){
  //     console.log("Error", err);
  //     Swal.fire({
  //       title: "Error",
  //       icon: "error",
  //       text: err.message
  //     });
  //   }
  //   setOpen(false);
  // };

  const getDeliveryAddres = async (id) => {
    try {
      const res = await axios.get(`${getDeliveryAddress}/${id}`);
      if (res.status === 200) {
        setAddress(res.data[0]);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Extracting day, month, year, hours, and minutes
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(date.getFullYear()).slice(2); // Last two digits of the year
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  return (
    <>
      {order.length === 0 ? (
        <Loader />
      ) : (
        <TableContainer
          component={Paper}
          sx={{ mb: 2, boxShadow: 3 }}
          onClick={() => setOpen(true)}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <Typography variant="h6" className="bg-color-1">
                    Order Details
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>User Name</strong>
                </TableCell>
                <TableCell>{address ? address.name : "Loading..."}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>User Address</TableCell>
                <TableCell>{`${address?.landmark}, ${address?.locality}, ${address.city}, ${address.state} - ${address.zip} `}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Product Category :</strong>
                </TableCell>
                <TableCell>
                  {productis ? productis.categories : "Loading..."}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Brand :</strong>
                </TableCell>
                <TableCell>
                  {productis ? productis.brand : "Loading..."}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Quantity :</strong>
                </TableCell>
                <TableCell>{order.quantity}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Order Amount:</strong>
                </TableCell>
                <TableCell>{order.orderAmount}/-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Payment Mode:</strong>
                </TableCell>
                <TableCell>{order.paymentMode}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Payment ID:</strong>
                </TableCell>
                <TableCell>{order.paymentId}</TableCell>
              </TableRow>
              <TableRow className="w-full justify-between">
                <TableCell className="w-1/2">
                  <strong>Order Date:</strong>
                </TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
              </TableRow>
              {true === "Admin" && (
                <TableRow>
                  <TableCell>
                    <strong>Vendor ID:</strong>
                  </TableCell>
                  <TableCell>{order.vendorId}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell>
                  <strong>Status:</strong>
                </TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {open && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <EditOrder
            order={order}
            productDetails={productis}
            onUpdate={handleUpdate}
            setOpen={setOpen}
          />
        </Dialog>
      )}
    </>
  );
};

export default OrderCard;
