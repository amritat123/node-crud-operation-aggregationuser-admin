// student data Schema----
const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const adminSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password : {
      type : String,
      required:true,
    },
    // profilePicture: {
    //   type: String,
    //   default: "",
    // },
    // token: {
    //   type: String,
    //   required: true,
    // },
    flag: {
      type: Number,
      default: 0, // 1=active, 2=deactivate 3 = deleted
    },
  },
  { timestamps: true }
);
adminSchema.plugin(aggregatePaginate);
adminSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("admin", adminSchema);
