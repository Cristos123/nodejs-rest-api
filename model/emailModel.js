const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      maxlength: 2,
    },
    subjectType: {
      type: String,
      maxlength: 2,
      required: true,
      default: "",
    },
    subjectId: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const Email = mongoose.model("Email", emailSchema);
module.exports = Email;
