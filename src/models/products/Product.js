import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    vendorId : {
        type : String,
        required : true,
    },
    name : {
        required: true,
        type : String,
    },
    description : {
        required: true,
        type : String,
    },
    brand : {
        type : String,
        required: true,
    },
    categories : {
        type : String,
        required: true,
    },
    display : {
        type : Boolean,
    },
    subCategory : {
        type : String,
    },
    image : {
        type : [String],
    },
    discountType : {

        type : String,
    },
    discount : {
        type : Number,
       
    },
    
    price : {
        type : Number,
        required: true,
    },
    sellingPrice : {
        type : Number,
        required: true,
    },
    unit : {
        type : String,
    },
    productQty : {
  
        type : String,
    },
    incDecBy : {
       
        type : Number,
    },

    minimumOrderQty : {
   
        type : Number,
    },
    availableQty : {
   
        type : Number,
    },
    foodPrefence : {
        type : String,
    },
    life : {
        type : String,
    }
})

const Product = mongoose.models['Product'] || mongoose.model('Product', productSchema);

export default Product;