import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import { useRouter } from "next/navigation";
import { getterFunction, searchProductsApi } from "@/Api";

const Search = () => {
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const router = useRouter();

  const fetchProducts = async (query) => {
    try {
      const response = await getterFunction(
        `${searchProductsApi}?query=${query}`
      );
      const validProducts = (response || []).filter(
        (product) => product && product.name
      );
      setFilteredProducts([...validProducts]); // Ensure a new reference
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  

  const handleInputChange = (event, value) => {
    setQuery(value);
    if (value.trim()) {
      fetchProducts(value);
    }
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      router.push(`/SearchResults?query=${query}`);
    }
  };

  const handleProductSelect = (event, value) => {
    const selectedProduct = filteredProducts.find(
      (product) => product.name === value
    );
    if (selectedProduct) {
      router.push(`/ProductDetails?product=${selectedProduct._id}`);
    }
  };



  

  return (
    <div className="flex items-center w-full max-w-md mx-auto relative">
      <Autocomplete
        freeSolo
        id="product-search"
        disableClearable
        options={filteredProducts.map((item) => item.name)}
        onInputChange={handleInputChange}
        onChange={handleProductSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearchSubmit();
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
                padding: "4px 8px",
                borderRadius: "24px",
              },
            }}
          />
        )}
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "24px",
          },
        }}
      />
    </div>
  );
};

export default Search;
