const Listing=require("../models/listing");

//index route

module.exports.index=async (req, res) => {
    let allListing = await Listing.find({});
    //  let{Title}=req.body;
    // console.log(a);
    res.render("listing/index.ejs", {allListing })
}


//new form route 

module.exports.renderNewform=(req, res) => {
    res.render("listing/new.ejs")
}

//show route

module.exports.showRoute=async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{path:"author"}})
        .populate("owner")
        
    res.render("listing/show.ejs", { listing, id })
}

//create Route

module.exports.createListing=async (req, res,next) => {
    // let result=listingschema.validate(req.body);
    // console.log(result)
    // if(result.error){
    //     throw new ExpressError(400,"Send valid data for listing")
    // }
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }

    const newdata = new Listing(req.body.listing);
    newdata.owner=req.user._id;
    await newdata.save();
    req.flash("success","New Listing created");
    res.redirect("/listing")
    
    // let{title,description, image, price, location, country}=req.params;

}

//edit route

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing})
    // res.send("hii")
}

//upadte

module.exports.updateListing=async (req, res) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing")
    // }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated");
    res.redirect("/listing");
}

//delete

module.exports.destroyListing= async (req, res) => {
    let { id } = req.params;
    let deletedata = await Listing.findByIdAndDelete(id);
    console.log(deletedata);
    req.flash("success","Listing deleted");
    res.redirect("/listing")
}