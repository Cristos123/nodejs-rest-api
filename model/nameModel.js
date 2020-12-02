const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nameSchema = new Schema(
  {
    status: {
      required: true,
      type: Number,
      min: 0,
      max: 2,
    },
    userId: {
      type: String,
     required:true
    },
    first: {
      type: String,
      required: true,
      maxlength: 32,
    },
    last: {
      type: String,
      maxlength: 32,
      required: true,
    },
  },
  { timestamps: true }
);

const Name = mongoose.model("Name", nameSchema);
module.exports = Name;
