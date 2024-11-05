const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

// Correctly create the model using the defined schema
const Unit = mongoose.models.Unit || mongoose.model("Unit", UnitSchema);

export default Unit;

