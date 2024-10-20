const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

const listingSchema = new Schema({
    title :{
      type :   String, 
      required : true,
    } ,
    description : String,
    image: {

      url: {
        type: String,
        default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDV8fHN1bnNldHxlbnwwfHx8fDE2OTQwNDAyMjc&ixlib=rb-1.2.1&q=80&w=400",
    },
        filename: {
            type: String,
            default: 'listingimage',
        },
    },
    price: Number,  
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
  owner : {
    type : Schema.Types.ObjectId,
    ref : "User",
  },
  
  geometry: {
    type: {
      type: String,
      enum: ['Point'],  // Ensure geometry type is "Point"
      required: true   // The type field must be included
    },
    coordinates: {
      type: [Number],  // Expecting an array with [longitude, latitude]
      required: true   // Ensure coordinates are always provided
    },
  },
  category:{
    type: String,
    enum:[
      "mountains",
      "rooms",
      "farms",
      "sea",
      "arctic",
      "large beds",
    ]
  },
});

listingSchema.post("findOneAndDelete" , async(listing)=>{
    if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
   


