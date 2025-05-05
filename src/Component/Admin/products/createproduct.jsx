import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  bulkUploadApi,
  createProduct,
  createSubCategory,
  createUnit,
  posterFunction,
} from '@/Api';
import axios from 'axios';
import { FaPercent } from 'react-icons/fa';
import { MdOutlineCurrencyRupee } from 'react-icons/md';
import { getSubCategories, getUnit } from '@/Redux/actions/productActions';
import {
  TextField,
  Button,
  Autocomplete,
  Box,
  Typography,
  Grid,
  Card,
  InputLabel,
  MenuItem,
} from '@mui/material';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '@/Context/functions';
import { getBrands, getCategories } from '@/Context/productFunction';
import UserContext from '@/userContext';
import * as XLSX from 'xlsx';
import Loader from '@/Component/helpers/loader';

// Default form data
const defaultFormData = {
  vendorId: '',
  name: '',
  description: '',
  brand: '',
  categories: '',
  subCategory: '',
  image: [],
  discount: 0,
  discountType: 'Percentage',
  price: 0,
  sellingPrice: 0,
  unit: '',
  productQty: 0,
  minimumOrderQty: 0,
  availableQty: 0,
  foodPrefence: '',
  life: '',
  incDecBy: 0,
};

// Reusable Form Field Component
const FormField = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  type = 'text',
  disabled,
  onKeyDown,
  select,
  children,
}) => (
  <TextField
    label={label}
    name={name}
    value={value === 0 ? '' : value}
    onChange={onChange}
    type={type}
    disabled={disabled}
    onKeyDown={onKeyDown}
    select={select}
    error={error}
    helperText={helperText}
    fullWidth
    variant="outlined"
    className="mb-4"
  >
    {children}
  </TextField>
);

// Image Upload Component
const ImageUpload = ({ images, onImageChange, disabled }) => (
  <Box className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
    <input
      type="file"
      accept="image/*"
      multiple
      id="image-upload"
      className="hidden"
      onChange={onImageChange}
      disabled={disabled}
    />
    <label htmlFor="image-upload">
      <Button
        variant="contained"
        component="span"
        startIcon={<MdOutlineCurrencyRupee />}
        disabled={disabled}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Upload Images
      </Button>
    </label>
    <Box className="flex flex-wrap gap-2">
      {images.map((url, index) => (
        <Image
          key={index}
          src={url}
          width={100}
          height={100}
          alt="Product Preview"
          className="rounded-md object-cover"
        />
      ))}
    </Box>
  </Box>
);

// Bulk Upload Component
const BulkUpload = ({ onFileUpload, onSubmit, disabled, productCount }) => (
  <Card elevation={3} className="p-4 mt-4 w-full max-w-md">
    <Box className="flex flex-col gap-4 items-center">
      <InputLabel>Upload Excel File</InputLabel>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={onFileUpload}
        className="text-sm"
      />
      <Button
        variant="contained"
        color="success"
        onClick={onSubmit}
        disabled={disabled || productCount === 0}
        className="w-full"
      >
        Upload {productCount > 0 ? `${productCount} Products` : 'Bulk Products'}
      </Button>
    </Box>
  </Card>
);

// Main CreateProduct Component
const CreateProduct = ({ setIndex, setCreateMode }) => {
  const dispatch = useDispatch();
  const { user } = useContext(UserContext);
  const unitsData = useSelector((state) => state.products.units);
  const subCategoryData = useSelector((state) => state.products.subCategories);

  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState([]);
  const [images, setImages] = useState([]);
  const [imageIds, setImageIds] = useState([]);
  const [tempImageUrls, setTempImageUrls] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState(['Create Unit']);
  const [subCategories, setSubCategories] = useState(['Create Sub Category']);
  const [discountType, setDiscountType] = useState('Percentage');
  const [bulkProducts, setBulkProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        dispatch(getSubCategories());
        dispatch(getUnit());
        const [brandData, categoryData] = await Promise.all([
          getBrands(),
          getCategories(),
        ]);
        setBrands(brandData?.data?.map((b) => b.name) || []);
        setCategories(categoryData?.data?.map((c) => c.name) || []);
      } catch (error) {
        Swal.fire('Error', 'Failed to fetch data', 'error');
      }
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  // Update units and subcategories
  useEffect(() => {
    setUnits([...(unitsData?.map((unit) => unit.name) || []), 'Create Unit']);
  }, [unitsData]);

  useEffect(() => {
    setSubCategories([
      ...(subCategoryData?.map((item) => item.name) || []),
      'Create Sub Category',
    ]);
  }, [subCategoryData]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const newImages = Array.from(e.target.files);
    const newUrls = newImages.map((img) => URL.createObjectURL(img));
    setImages((prev) => [...prev, ...newImages]);
    setTempImageUrls((prev) => [...prev, ...newUrls]);
  };

  const uploadImages = async () => {
    if (formData.image.length > 0) return;
    if (images.length === 0) {
      Swal.fire('Warning', 'Please select images', 'warning');
      return;
    }

    setLoading(true);
    try {
      const uploadedImages = await Promise.all(
        images.map((img) => uploadImageToCloudinary(img))
      );
      const successfulUploads = uploadedImages.filter((img) => img.response);
      const imageUrls = successfulUploads.map((img) => img.data.url);
      const newImageIds = successfulUploads.map((img) => img.data.public_id);

      setFormData((prev) => ({ ...prev, image: imageUrls, vendorId: user?._id }));
      setImageIds(newImageIds);
    } catch (error) {
      Swal.fire('Error', 'Failed to upload images', 'error');
    }
    setLoading(false);
  };

  const calculateSellingPrice = () => {
    const price = Number(formData.price);
    const discount = Number(formData.discount || 0);
    const sellingPrice =
      discountType === 'Percentage'
        ? price - (price * discount) / 100
        : price - discount;
    setFormData((prev) => ({ ...prev, sellingPrice }));
  };

  const validateForm = () => {
    const newErrors = Object.keys(defaultFormData).filter(
      (key) => !formData[key] && formData[key] !== 0
    );
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    await uploadImages();
    if (!validateForm()) {
      Swal.fire('Warning', 'Please fill all required fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(createProduct, {
        ...formData,
        vendorId: user._id,
      });
      if (response.status === 200) {
        Swal.fire('Success', 'Product created successfully', 'success');
        resetForm();
      }
    } catch (error) {
      imageIds.forEach((id) => deleteImageFromCloudinary(id));
      Swal.fire('Error', error.message, 'error');
    }
    setLoading(false);
  };

  const handleBulkSubmit = async () => {
    if (bulkProducts.length === 0) {
      Swal.fire('Error', 'No products in uploaded file', 'error');
      return;
    }

    setLoading(true);
    try {
      const formattedProducts = bulkProducts.map((product) => ({
        ...product,
        vendorId: user._id,
        image: [product.image1, product.image2, product.image3].filter(Boolean),
        discount: product.discount || 0,
      }));
      console.log(formattedProducts[1])
      await posterFunction(bulkUploadApi, { formData: formattedProducts });
      Swal.fire('Success', 'Bulk products uploaded successfully', 'success');
      setBulkProducts([]);
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
    setLoading(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      setBulkProducts(XLSX.utils.sheet_to_json(worksheet));
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setImages([]);
    setTempImageUrls([]);
    setImageIds([]);
  };

  const onEnterFocusNext = (e, nextId) => {
    if (['Enter', 'Tab'].includes(e.key)) {
      e.preventDefault();
      document.getElementById(nextId)?.focus();
    }
  };

  const handleCreateOption = async (type, value) => {
    if (value !== `Create ${type}`) {
      setFormData((prev) => ({ ...prev, [type.toLowerCase()]: value }));
      return;
    }

    const result = await Swal.fire({
      title: `Create ${type}`,
      input: 'text',
      inputLabel: `Enter ${type} Name`,
      showCancelButton: true,
      confirmButtonText: 'Create',
      inputValidator: (input) => !input && `Please enter a ${type.toLowerCase()} name`,
    });

    if (result.isConfirmed) {
      try {
        const endpoint = type === 'Unit' ? createUnit : createSubCategory;
        await axios.post(endpoint, { formData: result.value });
        Swal.fire('Success', `${type} created successfully`, 'success');
        dispatch(type === 'Unit' ? getUnit() : getSubCategories());
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    }
  };

  return (
    <Box className="p-4 max-w-7xl mx-auto">
      {loading && <Loader />}
      <Typography
        variant="h4"
        className="mb-6 text-center bg-gradient-to-r from-green-600 to-green-800 text-white py-2 rounded-md"
      >
        Create Product
      </Typography>

      <ImageUpload
        images={tempImageUrls}
        onImageChange={handleImageChange}
        disabled={loading}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <FormField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.includes('name')}
            helperText={errors.includes('name') ? 'Name is required' : ''}
            disabled={loading}
            onKeyDown={(e) => onEnterFocusNext(e, 'description')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormField
            id="description"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.includes('description')}
            helperText={errors.includes('description') ? 'Description is required' : ''}
            disabled={loading || !formData.name}
            onKeyDown={(e) => onEnterFocusNext(e, 'brand')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            id="brand"
            options={brands}
            value={formData.brand}
            onChange={(e, value) => setFormData((prev) => ({ ...prev, brand: value || '' }))}
            disabled={loading || formData.image.length === 0}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Brand"
                error={errors.includes('brand')}
                helperText={errors.includes('brand') ? 'Brand is required' : ''}
                onKeyDown={(e) => onEnterFocusNext(e, 'categories')}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            id="categories"
            options={categories}
            value={formData.categories}
            onChange={(e, value) =>
              setFormData((prev) => ({ ...prev, categories: value || '' }))
            }
            disabled={loading || formData.image.length === 0}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                error={errors.includes('categories')}
                helperText={errors.includes('categories') ? 'Category is required' : ''}
                onKeyDown={(e) => onEnterFocusNext(e, 'subCategory')}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            id="subCategory"
            options={subCategories}
            value={formData.subCategory}
            onChange={(e, value) => handleCreateOption('Sub Category', value)}
            disabled={loading || formData.image.length === 0}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sub Category"
                error={errors.includes('subCategory')}
                helperText={errors.includes('subCategory') ? 'Sub Category is required' : ''}
                onKeyDown={(e) => onEnterFocusNext(e, 'discountType')}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <FormField
                id="discountType"
                label="Discount Type"
                select
                value={discountType === 'Percentage' ? '0' : '1'}
                onChange={(e) => {
                  const type = e.target.value === '0' ? 'Percentage' : 'Rupees';
                  setDiscountType(type);
                  setFormData((prev) => ({ ...prev, discountType: type }));
                }}
                error={errors.includes('discountType')}
                helperText={errors.includes('discountType') ? 'Required' : ''}
                disabled={loading || formData.image.length === 0}
                onKeyDown={(e) => onEnterFocusNext(e, 'discount')}
              >
                <MenuItem value="0">
                  <FaPercent />
                </MenuItem>
                <MenuItem value="1">
                  <MdOutlineCurrencyRupee />
                </MenuItem>
              </FormField>
            </Grid>
            <Grid item xs={8}>
              <FormField
                id="discount"
                label={`Discount (${discountType})`}
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleChange}
                error={errors.includes('discount')}
                helperText={errors.includes('discount') ? 'Discount is required' : ''}
                disabled={loading || formData.image.length === 0}
                onKeyDown={(e) => onEnterFocusNext(e, 'price')}
                onBlur={calculateSellingPrice}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormField
            id="price"
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            error={errors.includes('price')}
            helperText={errors.includes('price') ? 'Price is required' : ''}
            disabled={loading || formData.image.length === 0}
            onKeyDown={(e) => onEnterFocusNext(e, 'unit')}
            onBlur={calculateSellingPrice}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormField
            label="Selling Price"
            name="sellingPrice"
            type="number"
            value={formData.sellingPrice}
            onChange={handleChange}
            error={errors.includes('sellingPrice')}
            helperText={errors.includes('sellingPrice') ? 'Selling Price is required' : ''}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            id="unit"
            options={units}
            value={formData.unit}
            onChange={(e, value) => handleCreateOption('Unit', value)}
            disabled={loading || formData.image.length === 0}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Unit"
                error={errors.includes('unit')}
                helperText={errors.includes('unit') ? 'Unit is required' : ''}
                onKeyDown={(e) => onEnterFocusNext(e, 'productQty')}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormField
            id="productQty"
            label={`Product Quantity (${formData.unit})`}
            name="productQty"
            type="number"
            value={formData.productQty}
            onChange={handleChange}
            error={errors.includes('productQty')}
            helperText={errors.includes('productQty') ? 'Quantity is required' : ''}
            disabled={loading || formData.image.length === 0}
            onKeyDown={(e) => onEnterFocusNext(e, 'minimumOrderQty')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormField
            id="minimumOrderQty"
            label="Minimum Order Quantity"
            name="minimumOrderQty"
            type="number"
            value={formData.minimumOrderQty}
            onChange={handleChange}
            error={errors.includes('minimumOrderQty')}
            helperText={errors.includes('minimumOrderQty') ? 'MOQ is required' : ''}
            disabled={loading || formData.image.length === 0}
            onKeyDown={(e) => onEnterFocusNext(e, 'incDecBy')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormField
            id="incDecBy"
            label="Increase/Decrease By"
            name="incDecBy"
            type="number"
            value={formData.incDecBy}
            onChange={handleChange}
            error={errors.includes('incDecBy')}
            helperText={errors.includes('incDecBy') ? 'Required' : ''}
            disabled={loading || formData.image.length === 0}
            onKeyDown={(e) => onEnterFocusNext(e, 'availableQty')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormField
            id="availableQty"
            label="Available Quantity"
            name="availableQty"
            type="number"
            value={formData.availableQty}
            onChange={handleChange}
            error={errors.includes('availableQty')}
            helperText={errors.includes('availableQty') ? 'Required' : ''}
            disabled={loading || formData.image.length === 0}
            onKeyDown={(e) => onEnterFocusNext(e, 'foodPrefence')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormField
            id="foodPrefence"
            label="Food Preference"
            name="foodPrefence"
            value={formData.foodPrefence}
            onChange={handleChange}
            error={errors.includes('foodPrefence')}
            helperText={errors.includes('foodPrefence') ? 'Required' : ''}
            disabled={loading || formData.image.length === 0}
            onKeyDown={(e) => onEnterFocusNext(e, 'life')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormField
            id="life"
            label="Shelf Life"
            name="life"
            value={formData.life}
            onChange={handleChange}
            error={errors.includes('life')}
            helperText={errors.includes('life') ? 'Required' : ''}
            disabled={loading || formData.image.length === 0}
            onKeyDown={(e) => onEnterFocusNext(e, 'submit')}
          />
        </Grid>
      </Grid>

      <Box className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
        <Button
          variant="contained"
          color="error"
          onClick={() => (setIndex ? setIndex('') : setCreateMode(false))}
          disabled={loading}
        >
          Cancel
        </Button>
        <Box className="flex gap-4">
          <Button
            variant="contained"
            color="info"
            onClick={resetForm}
            disabled={loading}
          >
            Reset
          </Button>
          <Button
            id="submit"
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={loading}
          >
            Create Product
          </Button>
        </Box>
      </Box>

      <Box className="flex justify-center mt-8">
        <BulkUpload
          onFileUpload={handleFileUpload}
          onSubmit={handleBulkSubmit}
          disabled={loading}
          productCount={bulkProducts.length}
        />
      </Box>
    </Box>
  );
};

export default CreateProduct;