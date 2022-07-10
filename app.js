const express = require("express");
const { userDataBase } = require('./mongoDB');
var cookieParser = require('cookie-parser');

// var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env'});

const app = express();

// app.use(cors({ origin: true, optionsSuccessStatus: 200, credentials: true }));
// app.options( "*", cors({ origin: true, optionsSuccessStatus: 200, credentials: true }) );
app.use(express.json(), cookieParser());

const PORT = process.env.PORT;
app.listen(PORT);

const authRouter = require('./controller/authController');

app.use('/', authRouter);



