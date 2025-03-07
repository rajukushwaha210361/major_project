const mongoose=require("mongoose");
const Schema= mongoose.Schema;
const Review=require("./review.js");
const listingschema= new Schema(
    {
        title:{
           type: String,
            require:true,
        },
        description:String,
        image:{
           type: String,
           default:"https://media.istockphoto.com/id/2152960533/photo/young-woman-using-digital-tablet-at-home.jpg?s=612x612&w=0&k=20&c=3I_AFpnNZSUhMASAIKL-Ny9C4Xtwm9wga4ibGLMLcqY=",
           set:(v)=>v===""?"https://media.istockphoto.com/id/2152960533/photo/young-woman-using-digital-tablet-at-home.jpg?s=612x612&w=0&k=20&c=3I_AFpnNZSUhMASAIKL-Ny9C4Xtwm9wga4ibGLMLcqY=":v,
        },
        price: { type: Number, default: 1 },
        // price:Number,
        location:String,
        country:String,
        reviews:[
            {
                type:Schema.Types.ObjectId,
                ref:"Review",
            },
        ],
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
        },
    },
);
listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
});
const Listing = mongoose.model("Listing",listingschema);
module.exports=Listing;


