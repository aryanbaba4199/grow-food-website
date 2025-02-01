import React, { useState, useEffect } from "react";
import { API_URL, updateProductsApi, updaterFunction } from "@/Api";
import { Button, TextField, Grid, Typography } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { AiOutlineUpload } from "react-icons/ai"; // Import an icon for image upload

const EditProducts = ({ product, setEditMode }) => {
  const [formData, setFormData] = useState({ ...product });
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    // Initialize imageFiles with the product's images
    if (product?.image) {
      setImageFiles(product?.image);
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleImageUpload = ()=>{

  }

  const handleSave = async () => {
    try {
      const res = await updaterFunction(`${updateProductsApi}`, {formData})
      
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Product updated successfully",
        });
        setEditMode(null);

    } catch (err) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: err.message,
      });
      console.log(err);
    }
  };

  const inputFields = Object.keys(formData)
    .filter((key) => key !== "_id" && key !== "__v" && key !== "image") // Exclude _id, __v, and image
    .map((key) => (
      <Grid item xs={12} key={key}>
        <TextField
          fullWidth
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          name={key}
          value={formData[key]}
          onChange={handleChange}
        
          margin="normal"
        />
      </Grid>
    ));

  return (
    <div className="px-8 p-2">
      <div className="flex justify-between w-full items-center">
        <Typography fontSize={22}>Edit Product</Typography>
      </div>

      <Grid container spacing={2}>
        {inputFields}
      </Grid>

      {/* Display images with upload option */}
      <div className="mt-4">
        <Typography variant="h6">Images</Typography>
        <div className="flex gap-2 mt-2">
          {imageFiles.map((imageUrl, index) => (
            <div key={index} className="relative">
              <img src={imageUrl} alt={`Product Image ${index + 1}`} className="h-24 w-24 object-cover" />
              <AiOutlineUpload 
                className="absolute top-0 right-0 text-xl cursor-pointer"
                onClick={() => document.getElementById(`file-input-${index}`).click()} // Trigger file input
              />
              <input 
                type="file" 
                id={`file-input-${index}`} 
                accept="image/*" 
                style={{ display: "none" }} 
                onChange={handleImageUpload}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={() => setEditMode(false)} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" style={{ marginLeft: '8px' }}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditProducts;
