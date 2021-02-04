const mongoose = require("mongoose");

const userRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 20,
  },
});

module.exports = mongoose.model("UserRole", userRoleSchema);
