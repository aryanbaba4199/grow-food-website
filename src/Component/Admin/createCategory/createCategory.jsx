import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Avatar,
} from "@mui/material";
import axios from "axios";
import Loader from "../../helpers/loader";
import { API_URL } from "@/Api";
import { useRouter } from "next/navigation";
import { getCategories } from "@/Redux/actions/productActions";
import Swal from "sweetalert2";
import { uploadImageToCloudinary, whosVisiting } from "@/Context/functions";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const CreateCategory = ({ user }) => {
  const [categoryName, setCategoryName] = useState("");
  const [icon, setIcon] = useState(null);
  const [iconURL, setIconURL] = useState("");
  const [loader, setLoader] = useState(false);
  const [tempIconURL, setTempIconURL] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const categories = useSelector((state) => state.products.categories);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      const x = whosVisiting();
      if (x !== "Admin" && x !== "Vendor") {
        router.push("/");
      }
    }, 1000);
  }, [router]);

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
      const res = await axios.post(`${API_URL}/api/products/createCategory`, {
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

  const handleDelete = async (category) => {
    if (!category) return;
    setLoader(true);
    try {
      const res = await axios.delete(
        `${API_URL}/api/products/deleteCategory/${category._id}`
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
          className="mb-4 mt-4 flex justify-center items-center"
        >
          <p className="flex  rounded-sm w-full  items-center">
                      <span className="w-[70%] text-center mb-8 h-10 px-4">Brands</span>
                      <button onClick={() => setOpen(true)} className="flex text-[24px] bg-green-200 px-4 py-1 rounded-lg gap-4">
                        Add Category
                      <FaPlus
                        
                        className="mx-2 my-1 hover:cursor-pointer bg-white text-green-700 rounded-full"
                      />
                      </button>
                    </p>
        </Typography>
        <List className="flex justify-between items-center border-b">
                  <ListItem className="flex-1 font-bold">Image</ListItem>
                  <ListItem className="flex-1 font-bold">Name</ListItem>
                  <ListItem className="flex-1 font-bold justify-center">Action</ListItem>
        
                </List>
        <List>
          {categories.map((item) => (
             <ListItem key={item._id} className="border-b flex justify-between mt-4">
              <ListItemAvatar className="flex-1">
                <Avatar className="w-20 h-20" src={item.icon} alt={item.name} />
              </ListItemAvatar>
              <ListItemText className="flex-1" primary={item.name} />
              <IconButton className="" onClick={() => handleEdit(item)}>
                <FaEdit className="text-green-500"/>
               
              </IconButton>
              {user === "admin" && (
                <IconButton onClick={() => handleDelete(item)}>
                  <FaTrash  className="text-red-600 ml-4"/>
                </IconButton>
              )}
            </ListItem>
          ))}
        </List>
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
          {user === "admin" && editMode ? (
            <>
              <Button onClick={handleUpdate} color="info">
                Update
              </Button>
              <Button onClick={() => handleDelete(selectedCategory)} color="error">
                Delete
              </Button>
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

export default React.memo(CreateCategory);