if(process.env.NODE_ENV != "production"){ 

require('dotenv').config();
}
// remove this after you've confirmed it is working


const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
// const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate); // use ejs-locals for all ejs templates:
app.use(express.static(path.join(__dirname, "/public")));


// const store = MongoStore.create({
//     mongoUrl : dbUrl,
//     crypto: {
//         secret: "mysupersecretcode"
//       },
//       touchAfter : 24 * 3600,
// });
// store.on("error", () => {
//     console.log("ERROR IN MONGO SESSION STORE" , err);
// });

const sessionOptions = {
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 7 * 24 *60 *60 *1000,
        maxAge :  7 * 24 *60 *60 *1000,
        httpOnly : true,   //security purposes (crosscripting attacks)
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    
    next();
});

app.use("/listings" , listingRouter); //next route se match hoga
app.use("/listings/:id/reviews",reviewRouter);
app.use("/" , userRouter);


app.all("*" , (req, res , next)=>{
    next(new ExpressError(404 , "Page Not Found!"));
});


app.use((err ,req, res , next )=>{
    let{statusCode=500 , message = "something went wrong!" } = err;
     res.status(statusCode).render("error.ejs" , {message});
});

app.listen(8080 , ()=>{
    console.log("server is listening on port 8080");
});
