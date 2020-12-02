const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passwordSchema = new Schema(
  {
    status: {
      type: String,
      maxlength: 2,
      required: true,
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
      required: true,
    },
  },
  { timestamps: true }
);

const Password = mongoose.model("Password", passwordSchema);
module.exports = Password;
