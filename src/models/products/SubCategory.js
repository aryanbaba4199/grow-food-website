const mongoose = require('mongoose')

const SubCategorySchema  = mongoose.Schema({
    name : {
        type: String,
        required: true
    }
})

const SubCategory = mongoose.models['SubCategory'] || mongoose.model("SubCategory", SubCategorySchema);

export default SubCategory;