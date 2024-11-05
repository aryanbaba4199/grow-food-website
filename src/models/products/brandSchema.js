
const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
    name : {
        required : true,
        type : 'string'
    }, 
    icon : {
        type : 'string'
    }
});

const Brand = mongoose.models['Brand'] || mongoose.model('Brand', brandSchema) ;

export default Brand;