import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  bulkUploadApi,
  createProduct,
  createSubCategory,
  createUnit,
  getSubCategoriesApi,
} from "@/Api";
import axios from "axios";
import { FaPercent } from "react-icons/fa";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { getSubCategories, getUnit } from "@/Redux/actions/productActions"; // Adjust the import path as needed
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Autocomplete, Box, Typography, Grid, IconButton, Card } from "@mui/material";
import Image from "next/image";
import Swal from "sweetalert2";
import { unitMeasureData } from "@/Context/projectData";
import deleteImageFromCloudinary, {
  uploadImageToCloudinary,
} from "@/Context/functions";
import { MdCameraFront } from "react-icons/md";
import {
  getBrands,
  getCategories,
  getUnits,
  memoize,
} from "@/Context/productFunction";
import { decryptData } from "@/Context/userFunction";
import Loader from "@/Component/helpers/loader";
import UserContext from "@/userContext";
import * as XLSX from "xlsx";



const CreateProduct = ({ setIndex, setCreateMode }) => {
  const defaultFormData = {
    vendorId: "",
    name: "",
    description: "",
    brand: "",
    categories: "",
    subCategory: "",
    image: [],
    discount: 0,
    discountType: "",
    price: 0,
    sellingPrice: 0,
    unit: "",
    productQty: 0,
    minimumOrderQty: 0,
    availableQty: 0,
    foodPrefence: "",
    life: "",
    incDecBy: 0,
  };

  const dispatch = useDispatch();
  // const brands = useSelector((state) => state.products.brands);
  // const categories = useSelector((state) => state.products.categories);
  const unitsData = useSelector((state) => state.products.units);
  const subCategoryData = useSelector((state) => state.products.subCategories);

  const [image, setImage] = useState("");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loader, setLoader] = useState(false);
  const [units, setUnits] = useState(["Create Unit"]);
  const [subCategory, setSubCategory] = useState(["Create Sub Category"]);
  const [imageId, setImageId] = useState([]);
  const [tempImageUrl, setTempImageURL] = useState("");
  const [productData, setProductData] = useState(defaultFormData);
  const [errorField, setErrorField] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [discountType, setDiscountType] = useState(0);
  const [bulkProducts, setBulkProducts] = useState([]);
  
  const {user} = useContext(UserContext);


  useEffect(() => {
    dispatch(getSubCategories());
    dispatch(getUnit());
    brandAndCategory();
  }, []);


  const handleFileUpload = (event) => {
    setLoader(true);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setBulkProducts(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
    setLoader(false);
  };

  

  const handleBulkSubmit = async () => {
    if (bulkProducts.length === 0) {
      Swal.fire({
        title: "Error",
        text: "No products found in the uploaded file.",
        icon: "error",
      });
      return;
    }

    setLoader(true);
    const formDataPromises = bulkProducts.map(async(product)=>{
     const imageArray = [
      product?.image1, product?.image2, product?.image3].filter(image=>image);
      // const description = await generateDescription(product);
      // console.log(description);
      return {
        ...product, 
        vendorId : user._id ?? 0, 
        image : imageArray,
        // discount : product.discount ? product.discount : 0, 
        // description: description || "No description available"
      }
    })

    
    try {
      const formData = await Promise.all(formDataPromises);
      const response = await axios.post(bulkUploadApi, {formData});
      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Products created successfully",
          icon: "success",
        });

        setBulkProducts([]);
        setLoader(false);
      }
    } catch (e) {
      setLoader(false);
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const brandAndCategory = async () => {
    const x = await getBrands();

    const cat = await getCategories();
    if (x) {
      setFilteredBrands(x.data);
    }
    if (cat) {
      setFilteredCategories(cat.data);
    }
  };

  useEffect(() => {
    const unitNames = unitsData.map((unit) => unit.name);
    setUnits([...unitNames, "Create Unit"]);
  }, [unitsData]);

  useEffect(() => {
    if (subCategoryData !== undefined) {
      const subCategoryName = subCategoryData?.map((item) => item.name);

      setSubCategory([...subCategoryName, "Create Sub Category"]);
    }
  }, [subCategoryData]);

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  // useEffect(()=>{
  //   if(imageId!=='' && errorField.length===0){
  //     handleSubmit();
  //   }
  // }, [imageId, errorField.length])


  const handleSubmit = async () => {
    setProductData({...productData, vendorId : user._id})
    setLoader(true);
    try {
      const response = await axios.post(createProduct, productData, {});
      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Product Created successfully",
          icon: "success",
        });

        setProductData(defaultFormData);
        setTempImageURL([]);
        setImageId([]);
        setLoader(false);
      }
    } catch (e) {
      imageId.map(async (item) => await deleteImageFromCloudinary(item));
      setLoader(false);
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const onEnterFocudNext = (e, id) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();

      document.getElementById(id)?.focus();
    }
  };

  const validateFormData = () => {
    const errors = [];

    for (let field in productData) {
      if (productData[field] === defaultFormData[field]) {
        errors.push(field);
      }
    }

    setErrorField(errors);

    if (errors.length === 0) {
      handleSubmit();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Required fields are blank",
      });
    }
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files); // Convert FileList to Array
    const newImageUrls = selectedImages.map((image) =>
      URL.createObjectURL(image)
    );

    setTempImageURL((prevUrls) => [...prevUrls, ...newImageUrls]); // Append new images
    setImage((prevImages) => [...prevImages, ...selectedImages]);
  };

  const handleUploadImage = async () => {
    if(productData.image.length > 0) {
      return;
    }
  
    if (image.length === 0) {
      Swal.fire({
        title: "Please Select Images",
        icon: "warning",
      });
      return;
    }
      setLoader(true);

    try {
      const uploadedImages = await Promise.all(
        image.map((image) => uploadImageToCloudinary(image))
      );

      const successfulUploads = uploadedImages.filter(
        (imageData) => imageData.response === true
      );

      const imageUrls = successfulUploads.map(
        (imageData) => imageData.data.url
      );
      const imageIds = successfulUploads.map(
        (imageData) => imageData.data.public_id
      );

      // Combine the updates into a single setProductData call
      setProductData((prevProductData) => ({
        ...prevProductData,
        image: imageUrls,
        vendorId: user?._id,
      }));
      setImageId(imageIds);
    } catch (e) {
      console.error(e);
      setLoader(false)
      Swal.fire({
        title: "Error uploading images",
        icon: "error",
        text: "An error occurred while uploading images.",
      });
    }
    setLoader(false)
  };

  // Remove useEffect since it's no longer needed

  const sellingPriceCalculator = () => {
    const price = productData.price;
    const discount = productData.discount ? productData.discount : 0;
    if (discountType == "0") {
      const x = price - (price * discount) / 100;
      setProductData({ ...productData, sellingPrice: x });
    } else if (discountType == "1") {
      const x = price - discount;
      setProductData({ ...productData, sellingPrice: x });
    }
  };



  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <Box className="p-4">
          <Typography
            variant="h4"
            className="mb-4 flex justify-center items-center "
          >
            <span className="bg-[#1e4426] rounded-s-md px-4 text-white">
              Create Product
            </span>
          </Typography>
          <div className="space-y-4">
            <div className="mb-6 flex flex-row px-2  justify-between">
              <input
                type="file"
                accept="image/*"
                multiple
                id="image-upload"
                className="px-2 text-black"
                onChange={handleImageChange}
                style={{ display: "none" }}
                required
              />
              <label htmlFor="image-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<MdCameraFront />}
                  color="primary"
                >
                  Upload Images
                </Button>
              </label>

              {tempImageUrl !== "" && (
                <>
                  {tempImageUrl.map((item, index) => (
                    <Image
                      key={index}
                      src={item}
                      width={200}
                      height={200}
                      className="rounded-md w-36 h-36"
                      alt="Grow Food"
                    />
                  ))}
                </>
              )}
            </div>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-2 ">
              <TextField
                label="Product Name"
                name="name"
                variant="outlined"
                fullWidth
                onBlurCapture={handleUploadImage}
                value={productData.name}
                onChange={handleChange}
                className="mb-4"
                error={errorField.includes("name")} // Check if 'name' is in errorField
                helperText={
                  errorField.includes("name") ? "Name is required" : ""
                } // Show an error message if in errorField
                onKeyDownCapture={(e) => onEnterFocudNext(e, "des")}
              />

              <TextField
                id="des"
                label="Description"
                name="description"
                variant="outlined"
                disabled={productData.name === ""}
                fullWidth
                onKeyDownCapture={(e) => onEnterFocudNext(e, "brand")}
                value={productData.description}
                onChange={handleChange}
                error={errorField.includes("description")} // Check if 'name' is in errorField
                helperText={
                  errorField.includes("description")
                    ? "description is required"
                    : ""
                }
                className="mb-4"
              />
              <Autocomplete
                id="brand"
                disabled={productData.image.length === 0}
                options={filteredBrands?.map((brand) => brand.name)} // List of brands
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Brand"
                    onKeyDownCapture={(e) => onEnterFocudNext(e, "category")}
                    name="brand"
                    fullWidth
                    className="mb-4"
                    error={errorField.includes("brand")} // Check if 'brand' is in errorField
                    helperText={
                      errorField.includes("brand") ? "Brand is required" : ""
                    }
                  />
                )}
                onInputChange={(event, newValue) => {
                  setProductData({ ...productData, brand: newValue });
                }}
                value={productData.brand}
              />

              <Autocomplete
                options={filteredCategories.map((item) => item.name)}
                id="category"
                disabled={productData.image.length === 0}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    name="categories"
                    variant="outlined"
                    fullWidth
                    onKeyDownCapture={(e) => onEnterFocudNext(e, "subCategory")}
                    className="mb-4"
                    error={errorField.includes("categories")} // Check if 'name' is in errorField
                    helperText={
                      errorField.includes("categories")
                        ? "Category is required"
                        : ""
                    }
                  />
                )}
                onInputChange={(event, value) => {
                  setProductData({ ...productData, categories: value });
                }}
                value={productData.categories}
              ></Autocomplete>

              <Autocomplete
                options={subCategory}
                id="subCategory"
                disabled={productData.image.length === 0}
                value={productData.subCategory}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={errorField.includes("subCategory")}
                    helperText={
                      errorField.includes("subCategory")
                        ? "Sub Category is required"
                        : ""
                    }
                    label="Sub Category"
                    name="subCategory"
                    fullWidth
                    className="mb-4"
                    onKeyDownCapture={(e) => onEnterFocudNext(e, "type")}
                  />
                )}
                onInputChange={(e, value) => {
                  if (value == "Create Sub Category") {
                    Swal.fire({
                      title: "Create Sub Category",
                      icon: "info",
                      input: "text",
                      inputAutoFocus: true,
                      inputLabel: "Enter Sub Category Name",
                      showCancelButton: true,
                      showConfirmButton: true,
                      confirmButtonText: "Create",
                      inputValidator: (inputValue) => {
                        if (!inputValue) {
                          return "Please enter a valid sub category name";
                        }
                        return null;
                      },
                    }).then(async (result) => {
                      if (result.isConfirmed) {
                        const formData = { name: result.value };
                        try {
                          const res = await axios.post(createSubCategory, {
                            formData,
                          });
                          if (res.status === 200) {
                            Swal.fire({
                              title: "Success",
                              icon: "success",
                              text: "Sub Category created successfully...",
                            });
                            dispatch(getSubCategories());
                          }
                        } catch (err) {
                          console.log(err);
                          Swal.fire(err.message);
                        }
                      }
                    });
                  } else {
                    setProductData({
                      ...productData,
                      subCategory: value,
                    });
                  }
                }}
              />

              <Grid container spacing={2} alignItems="center" className="mb-4">
                <Grid item xs={3}>
                  <TextField
                    error={errorField.includes("discountType")}
                    helperText={
                      errorField.includes("discountType") ? "required" : ""
                    }
                    select
                    label="Type"
                    id="type"
                    disabled={productData.image.length === 0}
                    value={productData.discountType === 1}
                    onChange={(e) => {
                      setDiscountType(e.target.value);
                      setProductData({
                        ...productData,
                        discountType:
                          discountType !== "1" ? "Rupees" : "Percentage",
                      });
                    }}
                    variant="outlined"
                    fullWidth
                    onKeyDownCapture={(e) => onEnterFocudNext(e, "discount")}
                  >
                    <MenuItem value="0">
                      <FaPercent />
                    </MenuItem>
                    <MenuItem value="1">
                      <MdOutlineCurrencyRupee className="text-lg" />
                    </MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={9}>
                  <TextField
                    label={`Discount in ${
                      discountType == "1" ? "Rupees" : "Percentage"
                    }`}
                    name="discount"
                    variant="outlined"
                    fullWidth
                    disabled={productData.image.length === 0}
                    id="discount"
                    type="number"
                    error={errorField.includes("discount")}
                    helperText={
                      errorField.includes("discount")
                        ? "discount is required"
                        : ""
                    }
                    value={
                      productData.discount === 0 ? "" : productData.discount
                    }
                    onChange={handleChange}
                    onKeyDownCapture={(e) => onEnterFocudNext(e, "price")}
                    onBlurCapture={sellingPriceCalculator}
                  />
                </Grid>
              </Grid>

              <TextField
                error={errorField.includes("price")}
                helperText={
                  errorField.includes("price") ? "price is required" : ""
                }
                label="Price"
                disabled={productData.image.length === 0}
                name="price"
                id="price"
                variant="outlined"
                fullWidth
                type="number"
                value={productData.price === 0 ? "" : productData.price}
                onChange={handleChange}
                className="mb-4"
                onKeyDownCapture={(e) => onEnterFocudNext(e, "unit")}
                onBlurCapture={sellingPriceCalculator}
              />
              <TextField
                error={errorField.includes("sellingPrice")}
                helperText={
                  errorField.includes("sellingPrice")
                    ? "Selling Price is required"
                    : ""
                }
                label="Selling Price"
                name="sellingPrice"
                variant="outlined"
                fullWidth
                type="number"
                value={
                  productData.sellingPrice == 0 ? "" : productData.sellingPrice
                }
                onChange={handleChange}
                disabled
                className="mb-4"
              />
              <Autocomplete
                options={units}
                disabled={productData.image.length === 0}
                id="unit"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={errorField.includes("unit")}
                    helperText={
                      errorField.includes("unit") ? "Unit is required" : ""
                    }
                    label="Product Unit"
                    name="unit"
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                    onKeyDownCapture={(e) => onEnterFocudNext(e, "prqty")}
                  />
                )}
                onInputChange={(e, value) => {
                  if (value == "Create Unit") {
                    Swal.fire({
                      title: "Create",
                      icon: "info",
                      input: "text",
                      inputAutoFocus: true,
                      inputLabel: "Enter unit Name",
                      showCancelButton: true,
                      showConfirmButton: true,
                      confirmButtonText: "Submit",
                      inputValidator: (inputValue) => {
                        if (!inputValue) {
                          return "Please enter a unit name!";
                        }
                        return null;
                      },
                    }).then(async (result) => {
                      if (result.isConfirmed) {
                        try {
                          const res = await axios.post(createUnit, {
                            formData: result.value,
                          });
                          if (res.status === 200) {
                            Swal.fire({
                              title: "success",
                              icon: "success",
                              text: "Unit Created Successfully",
                            });
                            dispatch(getUnit());
                          }
                        } catch (err) {
                          console.error(err);
                          Swal.fire(err.message);
                        }
                      }
                    });
                  } else {
                    setProductData({ ...productData, unit: value });
                  }
                }}
                onSelect={(event) => {
                  if (event.target.value === "Create Unit") {
                  }
                }}
                value={productData.unit}
              ></Autocomplete>

              <TextField
                disabled={productData.image.length === 0}
                id="prqty"
                label={`Product Quantity (${productData.unit})`}
                error={errorField.includes("productQty")}
                helperText={
                  errorField.includes("productQty")
                    ? "Product quantity is required"
                    : ""
                }
                name="productQty"
                variant="outlined"
                fullWidth
                value={
                  productData.productQty === 0 ? "" : productData.productQty
                }
                onChange={handleChange}
                className="mb-4"
                onKeyDownCapture={(e) => onEnterFocudNext(e, "moq")}
              />
              <TextField
                disabled={productData.image.length === 0}
                error={errorField.includes("minimumOrderQty")}
                helperText={
                  errorField.includes("minimumOrderQty")
                    ? "Minimum Order quantity is required"
                    : ""
                }
                label="Minimum Order Quantity"
                name="minimumOrderQty"
                variant="outlined"
                fullWidth
                id="moq"
                type="number"
                value={
                  productData.minimumOrderQty === 0
                    ? ""
                    : productData.minimumOrderQty
                }
                onChange={handleChange}
                className="mb-4"
                onKeyDownCapture={(e) => onEnterFocudNext(e, "incdec")}
              />
              <TextField
                id="incdec"
                disabled={productData.image.length === 0}
                label="Increase / Decrease by"
                error={errorField.includes("incDecBy")}
                helperText={
                  errorField.includes("incDecBy")
                    ? "Packet quantity is required"
                    : ""
                }
                name="incDecBy"
                variant="outlined"
                fullWidth
                type="number"
                value={productData.incDecBy === 0 ? "" : productData.incDecBy}
                onChange={handleChange}
                className="mb-4"
                onKeyDownCapture={(e) => onEnterFocudNext(e, "aq")}
              />
              <TextField
                disabled={productData.image.length === 0}
                id="aq"
                error={errorField.includes("availableQty")}
                helperText={
                  errorField.includes("availableQty")
                    ? "Available quantity is required"
                    : ""
                }
                label="Available Quantity"
                name="availableQty"
                variant="outlined"
                fullWidth
                type="number"
                value={
                  productData.availableQty === 0 ? "" : productData.availableQty
                }
                onChange={handleChange}
                className="mb-4"
                onKeyDownCapture={(e) => onEnterFocudNext(e, "foodpref")}
              />
              <TextField
                disabled={productData.image.length === 0}
                id="foodpref"
                label="Food Preference"
                name="foodPrefence"
                variant="outlined"
                fullWidth
                value={productData.foodPrefence}
                onChange={handleChange}
                className="mb-4"
                onKeyDownCapture={(e) => onEnterFocudNext(e, "life")}
              />
              <TextField
                id="life"
                disabled={productData.image.length === 0}
                label="Shelf Life"
                name="life"
                variant="outlined"
                fullWidth
                value={productData.life}
                onChange={handleChange}
                className="mb-4"
                onKeyDownCapture={(e) => onEnterFocudNext(e, "submit")}
              />
            </div>
            <div className="flex justify-between gap-2">
              <Button
                onClick={() => {
                  setIndex ? setIndex("") : setCreateMode(false);
                }}
                variant="contained"
                color="error"
              >
                Cancel
              </Button>
              <div className="flex gap-4">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => {
                    setProductData(defaultFormData);
                    setTempImageURL([]);
                    imageId.map(
                      async (item) => await deleteImageFromCloudinary(item)
                    );
                  }}
                >
                  Reset
                </Button>
                <Button
                  onClick={handleUploadImage}
                  variant="contained"
                  color="success"
                  id="submit"
                >
                  <span onClick={validateFormData}>Create Product</span>
                </Button>
              </div>
            </div>
          </div>
        </Box>
      )}
      <div className="mt-4 px-8 flex justify-center items-center">
        <Card elevation={3} className="px-8 p-4 mb-2">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload}/>
      <Button variant="contained" color="success" onClick={handleBulkSubmit} disabled={loader}>
        {bulkProducts.length>0 ? "Upload Bulk Products" :  "Upload Bulk Products"}
      </Button>
      </Card>
    </div>
    </>
  );
};

export default CreateProduct;
