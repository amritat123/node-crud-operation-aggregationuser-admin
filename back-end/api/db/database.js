
// connect to mongodb server
const mongoose = require('mongoose');
const {MongoClient} = require('mongodb');

require("dotenv").config();

const uri = process.env.mongoURI;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(uri, {useUnifiedTopology: true })
   .then(() => {
        console.log("--- Connected to MongoDB ---")
    })

    .catch(err => {
        console.log(err, "Not Connected to MongoDB")
    });

module.exports = client;