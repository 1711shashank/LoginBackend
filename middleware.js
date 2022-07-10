const jwt = require('jsonwebtoken');
const { userDataBase } = require('./mongoDB');

const middleware = async (req,res,next) => {
    try {

        let jwtToken = await req.cookies.jwtToken;
        const verifyToken = jwt.verify(jwtToken, process.env.SECRET_KEY);
        const userData = await userDataBase.findOne({_id: verifyToken._id, "tokens.token" : jwtToken});

        if(userData){

            res.token = jwtToken;
            res.userData = userData;
            res.userID = userData._id;

            // console.log(jwtToken, userData);

            next();
        }
        else{
            res.status(402).json({
                message: 'User Not Found',
                statusCode: 402
            })

        }
    } catch (error) {
        console.log(error);   
        res.status(401).send('Unauthorized User');
    }  
}

module.exports = middleware;