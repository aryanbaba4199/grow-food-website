import React, { useState, useContext, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Autocomplete, TextField, InputAdornment, Dialog } from "@mui/material";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import UserContext from "@/userContext";
import ProductDetails from "../product/Details";
import { decryptData } from "@/Context/userFunction";

const Search = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const { searchInput, setSearchInput } = useContext(UserContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const router = useRouter();

  // Fetch and filter products whenever searchInput changes
  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      const decryptedProducts = decryptData(storedProducts);
      if (decryptedProducts) {
        const options = decryptedProducts.filter((item) =>
          item.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilteredProducts(options);
      }
    }
  }, [searchInput]);

  // Handle search input change
  const handleInputChange = (event, value) => {
    setSearchInput(value);
  };

  // Handle product selection
  const handleProductSelect = (event, value) => {
    setSearchInput(value);
    router.push("/ProductDetails")
  };

  return (
    <>
      <Autocomplete
        freeSolo
        id="product-search"
        disableClearable
        options={filteredProducts.map((option) => option.name)}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              type: "search",
              placeholder: "Search",
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch style={{ color: "#1e4426", marginLeft: 8 }} />
                </InputAdornment>
              ),
              style: {
                backgroundColor: "#f3f4f6",
                color: "black",
                padding: 0,
              },
            }}
          />
        )}
        onInputChange={handleInputChange} // Update search query in input change
        onChange={handleProductSelect} // Handle product selection
      />

      <Dialog open={open} fullScreen onClose={() => setOpen(false)}>
        <ProductDetails product={selectedProduct} setOpen={setOpen} />
      </Dialog>
    </>
  );
};

export default Search;
