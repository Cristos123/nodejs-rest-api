const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usernameSchema = new Schema(
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
      maxlength: 16,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const Username = mongoose.model("Username", usernameSchema);
module.exports = Username;
