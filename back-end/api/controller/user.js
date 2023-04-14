// user api logic controller .
const UserModel = require("../model/user");
const niv = require("node-input-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

// register user...
exports.registerUser = async (req, res) => {
  let objValidation = new niv.Validator(req.body, {
    name: "required|maxLength:60",
    email: "required",
  });
  const match = await objValidation.check();
  // console.log(match);
  if (!match) {
    return res.status(404).send({
      message: "validation error",
      success: false,
    });
  }
  if (match) {
    // confirm the password
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password != confirmPassword) {
      return res.status(404).send({
        message: "password does not match please re-enter password",
        success: false,
      });
    }
  }
  try {
    let User = await UserModel.findOne({
      email: req.body.email,
    });
    if (User) {
      return res.status(404).send({
        message: "User already exists",
        success: false,
      });
    }
    let hash = "";
    if (req.body.password) {
      hash = await bcrypt.hash(req.body.password, 10);
    }
    const newUser = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      phone: req.body.phone,
      address: req.body.address,
      role: "User",
    });

    const result = await newUser.save();

    return res.status(200).send({
      message: "User registered successfully",
      success: true,
      data: result, // this data is key this will return the all data in the postman....
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Failed to register please try again later",
      success: false,
    });
  }
};

// login user ......
exports.loginUser = async (req, res) => {
  console.log("1", req.body);
  let objValidation = new niv.Validator(req.body, {
    email: "required|email",
    password: "required",
  });
  const match = await objValidation.check();
  if (!match) {
    return res.status(404).send({
      message: "validation error",
      success: false,
    });
  }
  if (match) {
    try {
      // check if the User exists
      const result = await UserModel.findOne({ email: req.body.email });
      // console.log(result);
      if (!result) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }
      if (result) {
        // check if the password is correct
        const checkPassword = await bcrypt.compare(
          req.body.password, // saved password in the db
          result.password
        );
        // console.log(checkPassword)
        if (!checkPassword) {
          return res.status(401).send({
            message: "Invalid password",
            success: false,
          });
        }
      }
      // if password is correct
      // Generating the user with  token
      const token = jwt.sign(
        {
          email: result.email,
          id: result._id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "10d",
        }
      );
      return res.status(200).send({
        message: "login successful",
        success: true,
        token: token,
        userInfo: result,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: " internal server error",
        success: false,
      });
    }
  }
};

// Get allUsers....
exports.getAllUser = async (req, res) => {
  let page = req.body.page;
  let search = req.body.search;
  let limit = req.body.limit;

  // Check if page is not a number, or undefined, null, empty string
  if (
    !Number.isInteger(page) ||
    [undefined, null, "", "undefined", "null"].includes(page)
  ) {
    page = 1; // Set default value as 1
  }

  // Check if search is not a string, or undefined, null, empty string
  if (
    typeof search !== "string" ||
    [undefined, null, "", "undefined", "null"].includes(search)
  ) {
    search = ""; // Set default value as empty string
  }

  // Check if limit is not a number, or undefined, null, empty string
  if (
    !Number.isInteger(limit) ||
    [undefined, null, "", "undefined", "null"].includes(limit)
  ) {
    limit = 10; // Set default value as 10
  }

  var options = {
    page: page,
    limit: limit,
    sort: {
      createdAt: -1,
    },
  };

  let matchObj = {};
  matchObj.flag = {
    $in: [1, 2],
  };

  const userAggregation = UserModel.aggregate([
    {
      $project: {
        name: 1,
        email: 1,
        phone: 1,
        address: 1,
        flag: 1,
        createdAt: 1,
      },
    },
    {
      $match: {
        $or: [
          {
            name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            phone: {
              $regex: search,
              $options: "i",
            },
          },
        ],
        flag: {
          $in: [1, 2],
        },
      },
    },
  ]);

  try {
    const result = await UserModel.aggregatePaginate(userAggregation, options);

    for (let i = 0; i < result.length; i++) {
      const element = result[i];
    }
    return res.status(200).send({
      message: "User returned successfully",
      result: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Request cannot be processed",
      success: false,
    });
  }
};
//Get all the User's details ........................................................
exports.getUserDetails = async (req, res) => {
  // console.log("1", req.id)
  let id = req.params.id;
  console.log("2", id);

  try {
    const result = await UserModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          created: 1,
          password: 1,
        },
      },
    ]);
    result = result[0];
    // if user does not exists.............
    if (!result) {
      return res.status(400).send({
        message: "user does not exists",
        success: false,
      });
    }
    // if user deactivated.....
    if (result.flag == 2) {
      return res.status(404).send({
        message: "sorry your account has been deactivated ",
        success: false,
      });
    }
    return res.status(200).send({
      message: "fetched user details successfully ",
      success: true,
      userInformation: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "request can be proceed",
      success: false,
    });
  }
};

exports.updateUser = async (req, res) => {
  console.log("1", req.body);
  var data = req.body
  id = req.params.id;
  const { name, email, phone, password } = req.body;
  // console.log("2");
  try {
    // console.log("3");
    const updateObj = {};
    // console.log("4");
    if (name) updateObj.name = name;
    if (phone)
    {
        const userResult = await UserModel.findOne({
          _id: { $ne:  new mongoose.Types.ObjectId(id) },
          phone: req.body.phone,
          flag: {
            $in: [1, 2],
          },
        });
        if (userResult) {
          return res.status(409).send({
            message: "phone already exists",
          });
        }
      }
      if (email) {
        const userResult = await UserModel.findOne({
          _id:  { $ne: new mongoose.Types.ObjectId(id) },
          email: req.body.email,
          flag: {
            $in: [1, 2],
          },
        });
        if (userResult) {
          return res.status(409).send({
            message: "Email already exists",
          });
        } else {
          updateObj.email = email;
        }
      }
      if (password) updateObj.password = await bcrypt.hash(password, 10);
      const result = await UserModel.findByIdAndUpdate(
        id,
        {
          $set: updateObj,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        message: "User has been successfully updated",
      updatedResult: data,
      });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "request can not be proceed",
      error: error,
    });
  }
};

