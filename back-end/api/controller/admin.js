const express = require("express");
const niv = require("node-input-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const adminModel = require("../model/admin");

// create admin API....
exports.createAdmin = async (req, res) => {
  const objValidation = new niv.Validator(req.body, {
    name: "required",
    phone: "required",
    email: "required",
  });
  const matched = await objValidation.check();
  if (!matched) {
    return res.status(422).send({
      message: "Validation error",
      errors: objValidation.errors
    });
  }
  try {
    if (matched) {
      // confirm admin password----------------
      const password = req.body.password;
      const confirm_password = req.body.confirm_password;

      if (confirm_password !== password) {
        res.status(400).send({
          message: " sorry password does not matched...",
          success: false,
        });
      }
    }
    const userResultPhone = await adminModel.findOne({
      phone: req.body.phone,
      flag: {
        $in: [1, 2],
      },
    });

    // check if user exists in database...with phone
    if (userResultPhone) {
      res.status(400).send({
        message: "User exists in database with phone",
        success: false,
      });
    }

    const userResultEmail = await adminModel.findOne({
      email: req.body.email,
      flag: {
        $in: [1, 2],
      },
    });
    //  check if user exists in database...with email address
    if (userResultEmail) {
      res.status(400).send({
        message: "User exists in database with this email address",
        success: false,
      });
    }

    // if user does not exist in database then create it new admin..............
    let hash = "";
    if (req.body.password) {
      hash = await bcrypt.hash(req.body.password, 10);
    }
    let image = "";
    if (req.file) image = req.file.path;

    const newAdmin = await adminModel({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: hash,
      countryCode: req.body.countryCode,
      profile_picture: image,
    });
    const adminResult = await newAdmin.save();

    // generate jwt token
    const token = jwt.sign(
      {
        phone: adminResult.email,
        id: adminResult._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "30d",
      }
    );
    return res.status(200).send({
      message: "admin created successfully",
      success: true,
      // token: token,
      admin: adminResult,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
      message: " something went wrong please try again later",
    });
  }
};


// get admin...
exports.getAdmin= async (req, res) => {
  const { name, phone, email, password, countryCode} = req.body;
  if([0, 1, "", "undefined" , "null", undefined, null].includes(page)) {
    page = 1
  }
  // limit
  if([1,0,"","null", "undefined", null, undefined].includes(limit)) {
    limit = 1
  }
  if(["","null", "undefined", null].includes(search)){
    search = "";
  }

  var option = {
    page:page,
    limit:limit,
    sort : {
      created: -1
    }
  }
}