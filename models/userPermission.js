const mongoose = require("mongoose");

const userPermissionSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 20,
    unique:true,
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("userPermission", userPermissionSchema);