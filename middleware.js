const Listing=require("./models/listing");
const ExpressError=require("./utils/ExpressError.js");
const{listingschema,reviewSchema}=require("./schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirecgUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
       res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();

}
module.exports.isOwner=async (req,res,next)=>{
  let {id}=req.params;
  let listing =await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/listing/${id}`)
  }
  next();
}
module.exports.validatelisting=(req,res,next)=>{
  let {error}=listingschema.validate(req.body);
  // console.log(result)
  if(error){
      let errmes=error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errmes)
  }else{
      next();
  }
}

module.exports.validatereview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  // console.log(result)
  if(error){
      let errmes=error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errmes)
  }else{
      next();
  }
}
