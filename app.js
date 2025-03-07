if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
    // .env file is used to store sensitive data and configuration settings in a Node.js project. 

}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;


const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate)
const ExpressError=require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const UserRouter=require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');//use session store
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"/public")));


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("Error in mongo session store")
})

const sessionOptions={
    store,
     secret:"mysecretcode",
     resave:false,
     saveUninitialized:true,
     Cookie:{
        expires:Date.now()+7*24*6*1000,
        maxAge:7*24*6*1000,
        httpOnly:true,
     }
};
 


app.get("/", (req, res) => {
    console.log("Home page")
    res.redirect("/listing")
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"raju@gmail.com",
//         username:"raju3103",
//     });
//     let registeruser=await User.register(fakeuser,"helloraju31");
//     res.send(registeruser);
// })

main().then((res) => {
    console.log(res)
}).catch(err => {
    console.log(err)
})
async function main() {
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(dbUrl);
}

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user; //passport autometically store userobject
    next();
})

app.use("/listing",listingRouter);
app.use("/listing/:id/review",reviewRouter)
app.use("/",UserRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="somethings went wrong"}=err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{message})
})
app.listen(8080, () => {
    console.log("Server is listeing i sport 8080")
})