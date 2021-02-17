const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    trim: true,
    required: true,
    unique:true,

  },
  value: {
    type: String,
    trim: true,
    required: true,
    
  },
});

module.exports = mongoose.model("Setting", settingSchema);