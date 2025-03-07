const express=require("express");
const router=express.Router();

const Listing = require("../models/listing.js")
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validatelisting}=require("../middleware.js")
const ListingController=require("../controllers/listing.js");

//index route

router.get("/",wrapAsync(ListingController.index))

// new route 

router.get("/new",isLoggedIn, ListingController.renderNewform
)
// show route 

router.get("/:id", wrapAsync(ListingController.showRoute))

// create route 
router.post("/",isLoggedIn,validatelisting,wrapAsync(ListingController.createListing))

//edit route

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.renderEditForm))

//update route 

router.put("/:id",isLoggedIn,isOwner,validatelisting,wrapAsync(ListingController.updateListing))

//delete route
router.delete("/:id",isOwner,wrapAsync(ListingController.destroyListing))

module.exports=router;
