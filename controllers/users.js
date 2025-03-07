const User=require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup=async(req,res)=>{
    try{
    let{username,email,password}=req.body;
    const newUser=new User({email,username});
    let registerUser=await User.register(newUser,password);
    console.log(registerUser);
    // req.login is prebuild function for direct loging
    req.login(registerUser,(err)=>{
        if(err){
           return next(err)
        }else{

            req.flash("success","Welcome to EasyStay")
            res.redirect("/listing");
        }
    })
    }catch(e){
        req.flash("error",);
        res.redirect("/signup");

    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login=
async(req,res)=>{
      req.flash("success","welcome to Easystay");
      let redirectUrl=res.locals.redirectUrl || "/listing";
      res.redirect(redirectUrl)
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("success","you are logged out");
            res.redirect("/listing")
        }
    })
}