// student data Schema----
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  // token: {
  //   type: String,
  //   required: true,
  // },
  flag: {
    type: Number,
    default: 1, // 1=active, 2=deactivate 3 = deleted
  }
});

module.exports = mongoose.model("admin", adminSchema);
