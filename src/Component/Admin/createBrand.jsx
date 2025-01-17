import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import Loader from "../helpers/loader";
import {
  API_URL,
  deleteBrandbyId,
  updateBrandbyId,
  updateOrderbyId,
} from "@/Api";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "@/Redux/actions/productActions";
import deleteImageFromCloudinary, {
  uploadImageToCloudinary,
} from "@/Context/functions";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import { decryptData } from "@/Context/userFunction";

const CreateBrand = ({user}) => {
  const [brandName, setBrandName] = useState("");
  const [icon, setIcon] = useState(null);
  const [iconURL, setIconURL] = useState("");
  const [loader, setLoader] = useState(false);
  const [tempIconURL, setTempIconURL] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [open, setOpen] = useState(false);
  const [imageId, setImageId] = useState("");

  const dispatch = useDispatch();
  const brands = useSelector((state) => state.products.brands);

  useEffect(() => {
    dispatch(getBrands());
  }, [dispatch]);

  useEffect(() => {
    if (iconURL !== "" && !editMode) {
      handleSubmit();
    }else if(iconURL !=="" && editMode){
      handleUpdate();
    }
  }, [iconURL]);

  const handleImageUpload = async () => {
    setLoader(true);
    try {
      const clRes = await uploadImageToCloudinary(icon);
      
      setIconURL(clRes.data.url);
      setImageId(clRes.data.public_id);
    } catch (e) {
      Swal.fire({
        title: "Failed",
        icon: "error",
        text: e.message,
      });
    } finally {
      setLoader(false);
    }
  };

  const handleSubmit = async () => {
    setLoader(true);
    try {
      const res = await axios.post(`${API_URL}/api/products/createBrand`, {
        name: brandName.toLowerCase(),
        icon: iconURL,
      });

      if (res.status === 200) {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Brand created successfully...",
        });
        resetForm();
        dispatch(getBrands()); // Refresh the brands list
      }
    } catch (err) {
      console.error("Error creating brand", err);
      Swal.fire({
        title: "Failed",
        icon: "error",
        text: err.message,
      });
      deleteImageFromCloudinary(imageId);
    } finally {
      setLoader(false);
    }
  };

  const handleImageChange = (e) => {
    const selectedIcon = e.target.files[0];
    if (selectedIcon) {
      const tempIconUrl = URL.createObjectURL(selectedIcon);
      setTempIconURL(tempIconUrl);
      setIcon(selectedIcon);
    }
  };

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    setBrandName(brand.name);
    setTempIconURL(brand.icon);
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedBrand) return;
    setLoader(true);
    try {
      const res = await axios.delete(`${deleteBrandbyId}/${selectedBrand._id}`);
      if (res.status === 200) {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Brand deleted successfully",
        });
        dispatch(getBrands());
        handleClose();
      } else {
        Swal.fire({
          title: "Failed",
          icon: "error",
          text: "Failed to delete brand",
        });
      }
    } catch (err) {
      console.error("Error deleting brand", err);
      Swal.fire({
        title: "Failed",
        icon: "error",
        text: "Failed to delete brand",
      });
    } finally {
      setLoader(false);
    }
  };

  const handleClose = () => {
    resetForm();
  };

  const handleUpdate = async () => {
    if(user!=='admin'){
      return;
    }
    if (!selectedBrand) return;
    setLoader(true);
    
    
      try {
        console.log('upload', updateBrandbyId)
        const res = await axios.put(`${updateBrandbyId}/${selectedBrand._id}`, {
          name: brandName.toLowerCase(),
          icon: iconURL ? iconURL : selectedBrand.icon,
        });
        
  
        if (res.status === 200) {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Brand updated successfully",
          });
          dispatch(getBrands());
          handleClose();
        } else {
          Swal.fire({
            title: "Failed",
            icon: "error",
            text: "Brand not found",
          });
        }
      } catch (err) {
        console.error("Error updating brand", err);
        Swal.fire({
          title: "Failed",
          icon: "error",
          text: "Bad Response",
        });
      } finally {
        setLoader(false);
      }
   
    
  };

  const resetForm = () => {
    setOpen(false);
    setEditMode(false);
    setBrandName("");
    setIcon(null);
    setIconURL("");
    setTempIconURL("");
  };

  const handleUpdateClick = ()=>{
    if(icon){
      handleImageUpload();
    }else{
      handleUpdate();
    }
  }

  return (
    <div>
      <div className="px-8">
        <Typography
          variant="h4"
          className="mb-4 mt-4 flex justify-center items-center "
        >
          <p className="flex bg-color-1 rounded-sm">
            <span className="rounded-s-md bg-color-1 h-10 px-4">Brands</span>
            <FaPlus
              onClick={() => setOpen(true)}
              className="mx-2 my-1 hover:cursor-pointer bg-white text-green-700 rounded-full"
            />
          </p>
        </Typography>
        <div className="flex flex-wrap gap-4 items-center mt-8 justify-between">
          {brands.map((item, index) => (
            <>
              <div
                key={index}
                className="h-28 flex-1 border shadow-md shadow-black flex flex-col justify-center items-center cursor-pointer"
                onClick={() => handleEdit(item)}
              >
                <img
                  src={
                    item?.icon ||
                    "https://media.designrush.com/inspiration_images/134802/conversions/_1511456315_653_apple-desktop.jpg"
                  }
                  className="w-24 h-20 rounded-lg"
                />
                <span className="bg-color-1 w-full text-center px-4 mt-2">
                  {item.name}
                </span>
              </div>
            </>
          ))}
        </div>
      </div>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? "Edit Brand" : "Create Brand"}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col space-y-4">
            <TextField
              style={{ marginTop: 8 }}
              label="Brand Name"
              variant="outlined"
              fullWidth
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
            <input type="file" onChange={handleImageChange} />
            {tempIconURL && (
              <div className="flex justify-center items-center mt-4">
                <img src={tempIconURL} alt="Brand Icon" className="w-20 h-20" />
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
          {editMode ? (
            <>
              <Button onClick={handleUpdateClick} color="primary">
                Update
              </Button>
              {user==='admin' &&
                <Button
                  onClick={() => {
                    handleDelete();
                  }}
                  color="error"
                >
                  Delete
                </Button>
              }
            </>
          ) : (
            <Button onClick={handleImageUpload} color="primary">
              Create
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {loader && <Loader />}
    </div>
  );
};

export default CreateBrand;
