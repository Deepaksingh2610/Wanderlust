const Joi = require('joi');
// const review = require('./models/review');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
       title : Joi.string().required(), 
       description : Joi.string().required(),
       location : Joi.string().required(),
       country : Joi.string().required(),
       price : Joi.number().required().min(0),
       image : Joi.string().allow("" , null),
       }).required()
});
    // geometry: Joi.object({
    //   type: Joi.string().valid("Point").required(),    // Ensure type is "Point"
    //   coordinates: Joi.array().items(Joi.number()).length(2).required()  // Coordinates should be [longitude, latitude]
    // }).required()  // Geometry is required
 

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required()

});