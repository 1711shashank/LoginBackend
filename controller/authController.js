const express = require("express");
const authRouter = express.Router();
const { userDataBase } = require('../mongoDB');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const middleware = require("../middleware");
const cookieParser = require('cookie-parser');


authRouter.post('/signup', async (req, res) => {

    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);
        if (!name || !email || !password) {
            res.status(422).json({
                message: 'Enter all details properly',
                statusCode: 422
            })
            return;
        }

        let userExists = await userDataBase.findOne({ email: email });
        if (userExists) {
            res.status(422).json({
                message: 'You already have an account with this email',
                statusCode: 422
            })
        }
        else {
            let newUserData = { name, email, password };
            await userDataBase.create(newUserData);

            res.status(200).json({
                message: 'Account created Successfully',
                statusCode: 200
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
            statusCode: 500
        })
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                message: 'Enter all details properly',
                statusCode: 400
            })
            return;
        }
        let userExists = await userDataBase.findOne({ email: email });
        if (userExists) {

            let isVaildPassword = await bcrypt.compare(password, userExists.password);

            const jwtToken = await userExists.generateAuthToken();

            res.cookie("jwtToken", jwtToken);

            if (isVaildPassword) {
                res.status(200).json({
                    message: 'Log in Successfully',
                    statusCode: 200
                })
            } else {
                res.status(201).json({
                    message: 'Incorrect Password',
                    statusCode: 201
                })
            }
        }
        else {
            res.status(201).json({
                message: 'Please Register',
                statusCode: 201
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
            statusCode: 500
        })
    }
})

authRouter.get('/about', middleware, async (req, res) => {
    try {
        console.log('About page');
        
        res.status(200).json({
            userData: res.userData,
            statusCode: 200
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
            statusCode: 500
        })
    }
})

authRouter.get('/logout', async (req, res) => {
    res.clearCookie('jwtToken', {path:'/'});
    res.status(200).json({
        message: 'User Logged Out',
        statusCode: 200
    })
})


module.exports = authRouter;
