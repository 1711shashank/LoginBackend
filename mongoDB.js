const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config({ path: './config.env' });


const db_link = process.env.DATABASE;

mongoose.connect(db_link)
    .then(() => {
        console.log("db connected");
    }).catch((err) => {
        console.log(err);
    })


// database stracture
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,

            }
        }
    ]
});

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12);
    }
    next();
})


userSchema.methods.generateAuthToken = async function () {
    try {
        let jwtToken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token : jwtToken });        
        await this.save();

        return jwtToken;

    } catch (err) {
        console.log(err);

    }
}

// userSchema.methods.deleteAuthToken = async function () {
//     try {
//         this.tokens = null     
//         await this.save();

//     } catch (err) {
//         console.log(err);
//     }
// }

const userDataBase = mongoose.model("USER", userSchema);
module.exports = { userDataBase };


