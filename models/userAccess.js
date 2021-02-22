const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userAccessSchema = new mongoose.Schema(
  {
    role: {
      type: ObjectId,
      ref: "userRole",
      required: true,
    },
    permission: {
      type: ObjectId,
      ref: "userPermission",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userAccess", userAccessSchema);
