const User = require("../models/user");
module.exports.registerForm = (req,res) => {
    res.render("users/register");
}
module.exports.newUser = async(req,res,next) => {
    const {username,email,confirm,password} = req.body;
    if(confirm === password){
        try{
        const user = new User({username,email});
        const registerUser =await User.register(user,password);
        req.login(registerUser, (err) => {
            if (err) return next(err);
            req.flash("success","Welcome to yelpcamp");
            res.redirect("/campgrounds");
        });
        }
        catch(e){
            req.flash("error",e.message);
            res.redirect("/user/register");
        } 
    } else {
        req.flash("error","Password do not match");
        res.redirect("/user/register");
    }
}
module.exports.loginForm = (req,res) => {
    res.render("users/login")
}
module.exports.login = (req,res) => {
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    req.flash("success","Welcome back!");
    res.redirect(redirectUrl); 
}
module.exports.logout = (req,res) => {
    req.logout();
    req.flash("success","Logged Out");
    res.redirect("/campgrounds");
}