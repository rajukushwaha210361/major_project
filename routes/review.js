const express=require("express");
const router=express.Router({mergeParams:true});//without mergeParams:true router cant not fatch params.id

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js")
const Review = require("../models/review.js");
const {validatereview, isLoggedIn}=require("../middleware.js")
const reviewcontroller=require("../controllers/reviews.js")
//review route
//post request
router.post("/",isLoggedIn,validatereview,wrapAsync(reviewcontroller.createReview)
)
//delete review route
router.delete("/:reviewId",wrapAsync(reviewcontroller.distroyReview))

module.exports=router;