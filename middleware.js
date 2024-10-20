const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");



module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){ //user trigers if user is logged in or not
         //information save
        //reDirectUrl save
        // req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next(); 
};

module.exports.saveRedirectUrl=(req,res ,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req , res , next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    // res.locals.currUser._id
      if(!listing.owner.equals(req.user._id)){
        req.flash("error" , "You are not the owner of this listing ");
        return res.redirect(`/listings/${id}`);
      }
      next();
};

// module.exports = (fn) => {
//     return (req, res, next) => {
//         fn(req, res, next).catch(next);
//     };
// };


module.exports.validateListing = (req,res, next)=>{
        let {error} = listingSchema.validate(req.body);
            if(error){
                let errmsg = error.details.map((el)=> el.message).join(",");
                throw new ExpressError(400 , errmsg);
            }else{
                next();
            }
            };

module.exports.validateReview = (req,res,next)=>{
        let {error} = reviewSchema.validate(req.body);
            if(error){
                let errmsg = error.details.map((el)=> el.message).join(",");
                throw new ExpressError(400 , errmsg);
            }else{
                next();
            }
};

module.exports.isreviewauthor = async(req , res , next)=>{
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
      if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the author of this review ");
        return res.redirect(`/listings/${id}`);
      }
      next();
};