// Main entry file for  the application
const DB = require("./api/db/database");
require("dotenv").config();
const express = require('express');
const adminRouter = require("./api/route/admin");
const userRouter = require("./api/route/user");
const app = express()

app.use(express.json())

// connect to routes and controllers to main server application
app.use('/',userRouter);
app.use('/', adminRouter);

const port = process.env.PORT||5000 ;
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`) , DB);