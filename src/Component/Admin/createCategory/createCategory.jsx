import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import Loader from "../../helpers/loader";
import { API_URL } from "@/Api";
import { useRouter } from "next/router";
import { getCategories } from "@/Redux/actions/productActions";
import Swal from "sweetalert2";
import { uploadImageToCloudinary, whosVisiting } from "@/Context/functions";
import { FaPlus } from "react-icons/fa";
import { decryptData } from "@/Context/userFunction";

const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [icon, setIcon] = useState(null);
  const [iconURL, setIconURL] = useState("");
  const [loader, setLoader] = useState(false);
  const [tempIconURL, setTempIconURL] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);


  const router = useRouter();

  useEffect(() => {
    const x = decryptData(localStorage.getItem("categories"));
    setCategories(x);
  }, []);

  const handleImageUpload = async () => {
    if (!icon) return "";
    try {
      const imageData = await uploadImageToCloudinary(icon);
      if (imageData.response) {
        return imageData.data.url;
      }
    } catch (err) {
      console.error("Error uploading image", err);
      Swal.fire("Error", "Error uploading image", "error");
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const uploadedUrl = await handleImageUpload();
      const res = await axios.post(`${API_URL}/products/createCategory`, {
        name: categoryName,
        icon: uploadedUrl,
      });

      if (res.status === 200) {
        Swal.fire("Success", "Category created successfully", "success");
        resetForm();
        dispatch(getCategories());
      } else {
        Swal.fire("Error", "Failed to create category", "error");
      }
    } catch (err) {
      console.error("Error creating category", err);
      Swal.fire("Error", "Failed to create category", "error");
    } finally {
      setLoader(false);
    }
  };

  const handleUpdate = async () => {
    setLoader(true);
    try {
      const uploadedUrl = await handleImageUpload();
      const res = await axios.put(
        `${API_URL}/api/products/updateCategory/${selectedCategory._id}`,
        { name: categoryName, icon: uploadedUrl || selectedCategory.icon }
      );
      if (res.status === 200) {
        Swal.fire("Success", "Category updated successfully", "success");
        resetForm();
        dispatch(getCategories());
      } else {
        Swal.fire("Error", "Failed to update category", "error");
      }
    } catch (err) {
      console.error("Error updating category", err);
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoader(false);
    }
  };

  useEffect(()=>{
    setTimeout(() => {
     const x= whosVisiting()
     if(!x==="Admin" || !x==="Vendor"){
      router.push("/")
     }
    }, 1000); 
  }, [])

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setLoader(true);
    try {
      const res = await axios.delete(
        `${API_URL}/api/products/deleteCategory/${selectedCategory._id}`
      );
      if (res.status === 200) {
        Swal.fire("Success", "Category deleted successfully", "success");
        resetForm();
        dispatch(getCategories());
      } else {
        Swal.fire("Error", "Failed to delete category", "error");
      }
    } catch (err) {
      console.error("Error deleting category", err);
      Swal.fire("Error", "Failed to delete category", "error");
    } finally {
      setLoader(false);
    }
  };

  const resetForm = () => {
    setCategoryName("");
    setIcon(null);
    setIconURL("");
    setTempIconURL("");
    setSelectedCategory(null);
    setOpen(false);
    setEditMode(false);
  };

  const handleImageChange = (e) => {
    const selectedIcon = e.target.files[0];
    if (selectedIcon) {
      const tempIconUrl = URL.createObjectURL(selectedIcon);
      setTempIconURL(tempIconUrl);
      setIcon(selectedIcon);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setIconURL(category.icon);
    setTempIconURL(category.icon);
    setEditMode(true);
    setOpen(true);
  };

  return (
    <div>
      <div className="px-8">
        <Typography
          variant="h4"
          className="mb-4 mt-4 flex justify-center items-center "
        >
          <p className="flex bg-color-1 rounded-sm">
            <span className="rounded-s-md bg-color-1 h-10 px-4">Category</span>
            <FaPlus
              onClick={() => setOpen(true)}
              className="mx-2 my-1 hover:cursor-pointer bg-white text-green-700 rounded-full"
            />
          </p>
        </Typography>
        <div className="flex flex-wrap justify-between gap-4 items-center mt-8">
          {categories.map((item, index) => (
            <div
              key={index}
              className="w-32 h-28 flex-1 pt-2 border shadow-md shadow-black flex flex-col justify-center items-center cursor-pointer"
              onClick={() => handleEdit(item)}
            >
              <img
                src={item?.icon || "https://via.placeholder.com/150"}
                className="w-20 h-16 rounded-md"
              />
              <span className="mt-2 w-full bg-color-1 text-center">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={open} onClose={resetForm}>
        <DialogTitle>
          {editMode ? "Edit Category" : "Create Category"}
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col space-y-12">
            <TextField
              style={{ marginTop: 8 }}
              label="Category Name"
              variant="outlined"
              fullWidth
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <input type="file" onChange={handleImageChange} />
            {tempIconURL && (
              <div className="flex justify-center items-center mt-4">
                <img
                  src={tempIconURL}
                  alt="Category Icon"
                  className="w-20 h-20"
                />
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm} color="secondary">
            Close
          </Button>
          {editMode ? (
            <>
              <Button onClick={handleUpdate} color="info">
                Update
              </Button>
              {decryptData(localStorage.getItem("user")).user.userType ===
                "Admin" && 
              <Button onClick={handleDelete} color="error">
                Delete
              </Button>
}
            </>
          ) : (
            <Button onClick={handleSubmit} color="primary">
              Create
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {loader && <Loader />}
    </div>
  );
};

export default CreateCategory;