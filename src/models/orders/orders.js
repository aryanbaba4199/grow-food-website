const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    productId : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    paymentId : {
        type : String,
    },
    paymentMode : {
        type : String,
    },
    orderAmount : {
        type : Number,
    },
    date : {
        type : Date,
    }, 
    orderStatus : {
        type : String,
    },
    addressId : {
        type : String,
        required : true
    },
    status : {
        type : String,
    },
    vendor : {
        type : String,
    }

});
const Order = mongoose.models['Order'] || mongoose.model('Order', orderSchema);

export default Order;