const User = require("../model/userModel");
const brcypt = require("bcrypt"); //  use for enycrept the Password

module.exports.register = async (req,res,next) => {  // register naam ka function
    // see browser se data vs code ke terminal par print ho raha hai JSON
    // For testing API:-
    // console.log(req.body); // fill register page and press button
    // res.send("API is working") // for Check http://localhost:5000/api/auth/register --> Post method

    try{
    const {username, email,password} = req.body;

    const usernameCheck = await User.findOne({username});
    // agar dataBase me user present hai to retune true
    if (usernameCheck){
        return res.json({msg: "Username already used", status: false});
    }
    
    const emailCheck = await User.findOne({email});
    if (emailCheck){
        return res.json({msg: "Email already used", status: false});
    }

    const hashedPassword = await brcypt.hash(password,10); // password enycrepted
    
    // for insert item in Database:-
    const user = await User.create({
        email,
        username,
        password: hashedPassword,
    });
    delete user.password; // frontend par password nahi show hoga
    return res.json({status: true, user })
    } catch(ex){
        next(ex);
    }
};
// for check API:-http://localhost:5000/api/auth/register --> Post->body-raw->json
// {
// 	"username": "deeepak8321",
// 	"email": "deepak8321@gmail.com",
// 	"password":"0000000000"
// }


module.exports.login = async (req,res,next) => {  // register naam ka function
    // see browser se data vs code ke terminal par print ho raha hai JSON
    // For testing API:-
    // console.log(req.body); // fill register page and press button
    // res.send("API is working") // for Check http://localhost:5000/api/auth/register --> Post method

    try{
    const {username,password} = req.body;
    const user = await User.findOne({username});
    // agar dataBase me user present hai to retune true
    if (!user){
        return res.json({msg: "Incorrect Username or password", status: false});
    }
    const isPasswordValid = await brcypt.hash(password,10);
    if (!isPasswordValid) {
        return res.json({msg: "Incorrect Username or password", status: false});
    }
    delete user.password; // frontend par password nahi show hoga
    return res.json({status: true, user })
    } catch(ex){
        next(ex);
    }
};
// for check API:-http://localhost:5000/api/auth/register --> Post->body-raw->json
// {
// 	"username": "deeepak8321",
// 	"password":"0000000000"
// }

module.exports.setAvatar = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const avatarImage = req.body.image;
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isAvatarImageSet: true,
          avatarImage,
        },
        { new: true }
      );
      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "username",
        "avatarImage",
        "_id",
      ]);
      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  };
