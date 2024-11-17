import React, { useState, useContext, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getterFunction } from "@/Api";

const Search = () => {
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const router = useRouter();

  // Fetch products based on the search input
  const fetchProducts = async (searchTerm) => {
    try {
      const response = await getterFunction(
        `/api/helpers/search?query=${searchTerm}`
      );
      setFilteredProducts(response.data); // Set search suggestions
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (event, value) => {
    setQuery(value);
    if (value.trim()) fetchProducts(value); // Fetch products as user types
  };

  const handleSearchSubmit = () => {
    if (query.trim() && selectedProductId) {
      router.push(`/Productdetails?product=${selectedProductId}`); // Redirect with productId
    }
  };

  const handleProductSelect = (event, value) => {
    const selectedProduct = filteredProducts.find(
      (product) => product.name === value
    );
    if (selectedProduct) {
      setSelectedProductId(selectedProduct._id); // Store the selected product's ID
      router.push(`/ProductDetails?product=${selectedProduct._id}`);
    }
  };

  return (
    <div className="flex items-center w-full max-w-md mx-auto relative">
      <Autocomplete
        freeSolo
        id="product-search"
        disableClearable
        options={filteredProducts.map((option) => option.name)} // Options for autocomplete
        onInputChange={handleInputChange}
        onChange={handleProductSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearchSubmit(); // Trigger search on Enter key
              }
            }}
            InputProps={{
              ...params.InputProps,
              type: "search",
              placeholder: "Search for products, brands, and more",
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch style={{ color: "#1e4426", marginLeft: 8 }} />
                </InputAdornment>
              ),
              style: {
                backgroundColor: "#f3f4f6",
                color: "black",
                padding: 0,
                borderRadius: "4px",
                paddingLeft: "8px",
                paddingRight: "8px",
              },
            }}
          />
        )}
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "24px", // Rounded search box style
          },
        }}
      />
    </div>
  );
};

export default Search;
