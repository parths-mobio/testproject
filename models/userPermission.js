const mongoose = require("mongoose");

const userPermissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
    unique:true,
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("userPermission", userPermissionSchema);