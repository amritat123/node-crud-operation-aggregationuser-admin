// user schema for  the current application
const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    flag: {
      type: Number,
      default: 1, // 1=active, 2=deactivate 3 = deleted
    },
  },
  { timeStamps: true }
);
userSchema.plugin(aggregatePaginate);
userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", userSchema);
