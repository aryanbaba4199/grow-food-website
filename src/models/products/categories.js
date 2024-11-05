const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name : {
        required : true,
        type : 'string' 
    },
    icon : {
        type : 'string',
    }
});

const Category = mongoose.models['Category'] || mongoose.model('Category', categorySchema);
export default Category;