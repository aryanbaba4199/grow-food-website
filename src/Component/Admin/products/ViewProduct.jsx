import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { DeleteApi } from "@/Api";



const ViewProduct = ({ product, setProduct, setEditMode }) => {


    const handleRemove = async() => {
        // try{
        //     const res = await DeleteApi()
        // }
    }
    const handleUpdate = ()=>{
        setEditMode(product)
        setProduct(null)
    }

  return (
    <div className=" flex justify-center items-center px-8">
      <Card className="max-w-md w-full mx-4 p-4  rounded-lg">
        <button
          onClick={()=>setProduct(null)}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
        >
          <IoMdClose size={24} />
        </button>

        {/* Product Image */}
        <CardMedia
          component="img"
          height="200"
          image={product?.image[0]}
          alt={product.name}
          className="rounded-lg"
        />

        <CardContent className="text-center">
          {/* Product Name and Price */}
          <Typography variant="h5" className="font-semibold text-[#15892e] mt-2">
            {product.name}
          </Typography>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            className="mb-1"
          >
            {product.brand} - {product.categories}
          </Typography>

          {/* Price Details */}
          <Grid container spacing={2} justifyContent="center" className="my-2">
            <Grid item>
              <Typography variant="body1" className="font-semibold">
                <span className="text-gray-700 line-through">₹{product.price}</span>
                <span className="text-green-600 ml-2">₹{product.sellingPrice}</span>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                {product.discount}% {product.discountType} off
              </Typography>
            </Grid>
          </Grid>

          {/* Other Details */}
          <Grid container spacing={1} justifyContent="center" className="mt-2">
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                <span className="font-semibold">Available Qty:</span> {product.availableQty} {product.unit}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                <span className="font-semibold">Minimum Order Qty:</span> {product.minimumOrderQty} {product.unit}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                <span className="font-semibold">Shelf Life:</span> {product.life}
              </Typography>
            </Grid>
          </Grid>

          {/* Description */}
          <Typography
            variant="body2"
            color="textSecondary"
            className="mt-4 text-left"
            style={{ fontStyle: 'italic', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px' }}
          >
            {product.description}
          </Typography>
            
          
        </CardContent>
        <div className="flex justify-between items-center absolute w-[80%] mt-6">
        <Button onClick={()=>handleRemove()} variant="contained" color="error">Delete</Button>
        <Button onClick={handleUpdate} variant="contained" color="success">Update</Button>
      </div>
      </Card>
      
    </div>
  );
};

export default ViewProduct;
