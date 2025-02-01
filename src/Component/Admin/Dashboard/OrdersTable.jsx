import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
} from "@mui/material";
import { FaEye } from "react-icons/fa";
import { MdLocationOn, MdProductionQuantityLimits } from "react-icons/md";
import { IoBagCheckOutline } from "react-icons/io5";
import { getDeliveryAddress, getterFunction, usersAPi } from "@/Api";

const OrdersTable = ({ orders }) => {
  const [open, setOpen] = useState(false); // State to control the dialog
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store the selected order details
  const [address, setAddress] = useState(null)
  const handleDialogOpen = (order) => {
    setSelectedOrder(order); // Set the selected order details
    setOpen(true); // Open the dialog
  };

  const handleDialogClose = () => {
    setSelectedOrder(null); // Clear the selected order details
    setOpen(false); // Close the dialog
  };

  useEffect(()=>{
    if(selectedOrder){
      getAddress(selectedOrder?.addressId);
    }
    
  }, [selectedOrder])

  const getAddress = async (addressId) => {
    try {
      const response = await getterFunction(`${getDeliveryAddress}/${addressId}`)
      setAddress(response)
      console.log(response);
    } catch (error) {
      console.error('Error in getting address',error);
    }
  }

  console.log(selectedOrder)

  return (
    <>
      {orders && (
        <div>
          {orders.length !== 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>SN</strong></TableCell>
                    <TableCell><strong>Order ID</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Brand</strong></TableCell>
                    <TableCell><strong>Qty</strong></TableCell>
                    <TableCell><strong>Price</strong></TableCell>
                    <TableCell><strong>Order Amount</strong></TableCell>
                    <TableCell><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((row, orderIndex) =>
                    row.productDetails.map((product, productIndex) => (
                      <TableRow key={`${orderIndex}-${productIndex}`}>
                        <TableCell>{orderIndex + 1}</TableCell>
                        <TableCell>{row?.orderId}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.totalPrice}</TableCell>
                        <TableCell>
                          <FaEye
                            className="text-lg text-[#15892e] cursor-pointer"
                            onClick={() => handleDialogOpen(row)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Dialog to show order details */}
          <Dialog
            open={open}
            onClose={handleDialogClose}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle
              alignSelf="center"
              fontWeight={700}
              fontSize={25}
              color="black"
            >
              Order Details
            </DialogTitle>
            <DialogContent>
              {selectedOrder && (
                <div>
                  {selectedOrder.productDetails.map((product, index) => (
                    <Card key={index} elevation={4} className="px-8 py-1 m-2">
                      <p className=" flex gap-2 items-center font-semibold text-[#15892e]">
                        <MdProductionQuantityLimits className="text-lg font-bold bg-green-300 w-6 rounded-full p-1 h-6" />
                        Product Details
                      </p>
                      <p>
                        <strong>Product Name:</strong> {product.name}
                      </p>
                      <p>
                        <strong>Category :</strong> {product.category}
                      </p>
                      <p>
                        <strong>Brand:</strong> {product.brand}
                      </p>
                      <p>
                        <strong>Discount :</strong> {product.discount}{" "}
                        {product.discountType}
                      </p>
                      <p>
                        <strong>Price:</strong> {product.price}
                      </p>
                      {/* <p>
                        <strong>Quantity :</strong> {selectedOrder.productQty}
                      </p> */}
                      <p>
                        <strong>Selling Price:</strong> {product.sellingPrice}
                      </p>
                    </Card>
                  ))}

                  <Card elevation={4} className="px-8 py-1 m-2 my-4">
                    <p className=" flex gap-2 items-center font-semibold text-[#15892e]">
                      <MdLocationOn className="text-lg font-bold bg-green-300 w-6 rounded-full p-1 h-6" />
                      Delivery Details
                    </p>
                    {address && 
                    <>
                    <p>
                      <strong>Client Name:</strong>{" "}
                      {address.name}
                    </p>
                    <p>
                      <strong>Client Mobile:</strong>{" "}
                      {address.mobile}
                    </p>
                    <p>
                      <strong>Client Address:</strong>{" "}
                      {`${address.locality}, ${address.city}, ${address.state}, ${address.zip}`}
                    </p>
                    </>
                    }
                  </Card>
                  <Card elevation={4} className="px-8 py-1 m-2 my-4">
                    <p className=" flex gap-2 items-center font-semibold text-[#15892e]">
                      <IoBagCheckOutline className="text-lg font-bold bg-green-300 w-6 rounded-full p-1 h-6" />
                      Order Details
                    </p>
                    <p>
                      <strong>Payment Mode :</strong>{" "}
                      {selectedOrder.paymentMode}
                    </p>
                    <p>
                      <strong>Payment ID :</strong> {selectedOrder.paymentId}
                    </p>
                    <p>
                      <strong>Order Quantity :</strong>{" "}
                      {selectedOrder.productQty}
                    </p>
                    <p>
                      <strong>Order Amount :</strong> {selectedOrder.venOrderAmount}
                    </p>
                    <p>
                      <strong>Order Date:</strong>{" "}
                      {new Date(selectedOrder.date).toLocaleString()}
                    </p>
                    <p>
                      <strong>Order Status :</strong>{" "}
                      {selectedOrder?.status.toUpperCase()}
                    </p>
                  </Card>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Close
              </Button>
              <Button onClick={handleDialogClose} color="primary">
                Update Status
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default OrdersTable;
