const express = require("express"); 
const router = express.Router();   
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage}); 
// Files uploaded using 'upload' will be saved to the specified storage (e.g., Cloudinary)
//upload nam ke folder mei save


// Index Route ---> for showing all listings 
// and   //Create Route
router.route("/")
.get( wrapAsync(listingController.index))
.post(
  isLoggedIn, 
  upload.single('listing[image]'),
  validateListing , 
  wrapAsync(listingController.createListing),
);

 // New Route--> to create a new listing
 router.get("/new" , 
  isLoggedIn, 
  listingController.rendernewForm );


//Show Route---> All data of particular id 
  //Update Route
  // Delete route 
router.route("/:id")
.get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
     validateListing , 
     wrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,isOwner,
   wrapAsync(listingController.destroyListing)
 );

  //Edit Route
  router.route("/:id/edit")
  .get(isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

  
  module.exports = router;