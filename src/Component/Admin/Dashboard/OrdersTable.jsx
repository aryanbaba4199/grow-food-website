import React, { useState } from "react";
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

const OrdersTable = ({ orders }) => {
  const [open, setOpen] = useState(false); // State to control the dialog
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store the selected order details

  const handleDialogOpen = (order) => {
    setSelectedOrder(order); // Set the selected order details
    setOpen(true); // Open the dialog
  };

  const handleDialogClose = () => {
    setSelectedOrder(null); // Clear the selected order details
    setOpen(false); // Close the dialog
  };


  return (
    <>
      {orders && (
        <div>
          {orders.length !==0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>SN</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Brand</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Qty</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Price</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Order Amount</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Payment ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Client Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Action</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell> {row.productDetails?.name} </TableCell>
                      <TableCell> {row.productDetails?.brand} </TableCell>
                      <TableCell> {row.quantity} </TableCell>
                      <TableCell> {row.productDetails?.sellingPrice} </TableCell>
                      <TableCell> {row.orderAmount} </TableCell>
                      <TableCell> {row.paymentId} </TableCell>
                      <TableCell> {row.address[0]?.name} </TableCell>
                      <TableCell>
                        <FaEye
                          className="text-lg text-[#15892e] cursor-pointer"
                          onClick={() => handleDialogOpen(row)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
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
                  <Card elevation={4} className="px-8 py-1 m-2">
                    <p className=" flex gap-2 items-center font-semibold text-[#15892e]">
                      <MdProductionQuantityLimits className="text-lg font-bold bg-green-300 w-6 rounded-full p-1 h-6" />
                      Product Details
                    </p>
                    <p>
                      <strong>Product Name:</strong>{" "}
                      {selectedOrder.productDetails?.name}
                    </p>
                    <p>
                      <strong>Category :</strong>{" "}
                      {selectedOrder.productDetails?.categories}
                    </p>
                    <p>
                      <strong>Brand:</strong>{" "}
                      {selectedOrder.productDetails?.brand}
                    </p>
                    <p>
                      <strong>Discount :</strong>{" "}
                      {selectedOrder.productDetails?.discount}{" "}
                      {selectedOrder.productDetails?.discountType}
                    </p>

                    <p>
                      <strong>Price:</strong>{" "}
                      {selectedOrder.productDetails?.price}
                    </p>
                    <p>
                      <strong>Price:</strong>{" "}
                      {selectedOrder.productDetails?.sellingPrice}
                    </p>
                    </Card>

                    <Card elevation={4} className="px-8 py-1 m-2 my-4">
                    <p className=" flex gap-2 items-center font-semibold text-[#15892e]">
                      <MdLocationOn className="text-lg font-bold bg-green-300 w-6 rounded-full p-1 h-6" />
                      Delivery Details
                    </p>
                    <p>
                      <strong>Client Name:</strong>{" "}
                      {selectedOrder.address[0]?.name}
                    </p>
                    <p>
                      <strong>Client Mobile:</strong>{" "}
                      {selectedOrder.address[0]?.mobile}
                    </p>
                    <p>
                      <strong>Client Address:</strong>{" "}
                      {`${selectedOrder.address[0]?.locality}, ${selectedOrder.address[0]?.city}, ${selectedOrder.address[0]?.state}, ${selectedOrder.address[0]?.zip}`}
                    </p>
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
                      <strong>Order Quantity :</strong> {selectedOrder.quantity}
                    </p>
                    <p>
                      <strong>Order Amount :</strong> {selectedOrder.quantity}
                    </p>
                    <p>
                      <strong>Order Date:</strong>{" "}
                      {new Date(selectedOrder.date).toLocaleString()}
                    </p>
                    <p>
                      <strong>Order Status :</strong>{" "}
                      {selectedOrder?.orderStatus}
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
