const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    uniqueString: {
      type: String,
      required: true,
      min: 0,
      max: 16,
    },
    status: {
      type: Number,
      min: 0,
      max: 3,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
