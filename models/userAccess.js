const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userAccessSchema = new mongoose.Schema(
  {
    role: {
      type: ObjectId,
      ref: "userRole",
      required: true,
    },
    permissions:[ {
      type: ObjectId,
      ref: "userPermission",
     
    }
  ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("userAccess", userAccessSchema);
