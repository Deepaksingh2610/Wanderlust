
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email : {
        type : String,
        required : true,
    },
});   //email do baki username and password khud generate hojayega

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);