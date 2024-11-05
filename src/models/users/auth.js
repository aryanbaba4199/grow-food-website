const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  shopName : {
    required: true,
    type: String,
  },
  shopAddress : {
    type: String,
    required: true,
  },
  gst : {
    type: String,
  }, 
  userType : {
    required: true,
    type: String,
  },
  userStatus : {
    type: String,
  },
  name: {
    required: true,
    type: String, 
  },
  email: {
    required: true,
    type: String,
    unique: true,
    
    lowercase: true, 
  },
  password: {
    required: true,
    type: String,
     
  },
  mobile: {
    required: true,
    type: String,
  },
  image : {
    type: String,
  }
  
  
});

const User = mongoose.models['User'] || mongoose.model('User', authSchema);

module.exports = User;
