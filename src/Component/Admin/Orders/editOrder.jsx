import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton
} from "@mui/material";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";
import { updateOrderbyId } from "@/Api";
import { fetchOrders } from "@/Redux/actions/orderAction";

const EditOrder = ({ order, productDetails, setOpen }) => {
  const [updatedOrder, setUpdatedOrder] = useState({...order});
  const [showFailureReason, setShowFailureReason] = useState(false);

  const dispatch = useDispatch();


  useEffect(() => {
    setUpdatedOrder(order);
    setShowFailureReason(order.status === "Failure");
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedOrder((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "status" && value === "Failure" && { failureReason: "" }),
    }));
    setShowFailureReason(name === "status" && value === "Failure");
  };

  

  const handleUpdateOrder = async()=>{

    try{
      const res = await axios.put(`${updateOrderbyId}/${order._id}`, {formData : updatedOrder});
      if(res.status===200){
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Order updated successfully"
        })
        dispatch(fetchOrders())
        setOpen(false);
      }
    }catch(err){
      console.error(err)
      Swal.fire({
        title : 'Error', 
        icon : 'error',
        text : err.message,
      })
    };
  }

  return (
    <>
      <DialogTitle className="bg-color-1">
        Edit Order
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <MdClose />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          
          
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={updatedOrder.quantity}
              onChange={handleChange}
              onBlur={()=>setUpdatedOrder({
                ...updatedOrder,
                orderAmount : updatedOrder.quantity*productDetails.sellingPrice
              })}
              onMouseLeave={()=>setUpdatedOrder({
                ...updatedOrder,
                orderAmount : updatedOrder.quantity*productDetails.sellingPrice
              })}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Order Amount"
              name="orderAmount"
              type="number"
              disabled
              value={updatedOrder.quantity*productDetails?.sellingPrice || ""}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Payment Mode"
              name="paymentMode"
              value={updatedOrder.paymentMode || ""}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Payment ID"
              name="paymentId"
              value={updatedOrder.paymentId || ""}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="status"
                value={updatedOrder.status || ""}
                onChange={handleChange}
              >
                {["Not Processed", "Processed", "In Shipment", "Ready to Deliver", "Success", "Failure"].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {showFailureReason && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Failure Reason"
                name="failureReason"
                value={updatedOrder.failureReason || ""}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        {/* {JSON.parse(localStorage.getItem('user')).user.userStatus==="Verified" && JSON.parse(localStorage.getItem('user')).userType==="Admin" &&
        <Button>
          Delete Product
        </Button>
        } */}
        <Button variant="contained"  onClick={() => handleUpdateOrder()} color="success">
          Update
        </Button>
        
      </DialogActions>
    </>
  );
};

export default EditOrder;
