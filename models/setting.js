const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    key_en: {
      type: String,
    },
    key_fr: {
      type: String,
    },
    value_en: {
      type: String,
      trim: true,
    },
    value_fr: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);
