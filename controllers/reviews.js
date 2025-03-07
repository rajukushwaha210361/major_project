const Review=require("../models/review");
const Listing=require("../models/listing");
module.exports.createReview=async(req,res)=>{
    let Listingid= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview)
    Listingid.reviews.push(newReview);
    await newReview.save();
    await Listingid.save();
    // res.send("success")
    req.flash("success","New review created");
    res.redirect(`/listing/${Listingid._id}`)
    
}
module.exports.distroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listing/${id}`);
}