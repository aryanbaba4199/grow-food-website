import React, { useState, useEffect } from "react";
import { API_URL } from "@/Api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const EditProducts = ({ open, onClose, product, setEditMode, setOpen }) => {
  const [formData, setFormData] = useState({ ...product });
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    setFormData({ ...product });
    setDisplay(product.display ?? true);
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`${API_URL}/api/products/updateProduct`, {
        formData,
      });
      if (res.status === 200) {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Product updated successfully",
        });
        setOpen(false);
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: err.message,
      });
      console.log(err);
    }
  };

  console.log(display, formData.display);

  const inputFields = Object.keys(formData)
    .filter((key) => key !== "_id" && key !== "__v")
    .map((key) => (
      <Grid item xs={12} key={key}>
        <TextField
          fullWidth
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          name={key}
          value={formData[key]}
          onChange={handleChange}
          disabled={key === "sellingPrice"}
          margin="normal"
        />
      </Grid>
    ));

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="flex justify-between w-full items-center">
        <DialogTitle>Edit Product</DialogTitle>

        <div className="flex justify-start items-center w-full">
          <div
            className={`${
              display ? "bg-color-1 justify-end" : "bg-red-600 justify-start"
            } h-8 w-24 rounded-3xl flex  items-center ease-in-out  `}
          >
            {display && (
              <span className="text-white text-sm pr-1">Showing</span>
            )}
            <div
              className="w-7 h-7 shadow-md shadow-black rounded-full bg-purple-600 flex ease-in-out"
              onClick={() => {
                setDisplay(true ? false : true);
                setFormData({
                  ...formData,
                  display: display === true ? false : true,
                });
              }}
            ></div>
            {!display && (
              <span className="text-white text-sm pl-1">Hidden</span>
            )}
          </div>
        </div>
      </div>

      <DialogContent>
        <Grid container spacing={2}>
          {inputFields}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setEditMode(false);
            setOpen(false);
          }}
          color="secondary"
        >
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProducts;
