const User = require("../models/userModel");
const bcrypt = require("bcrypt");


// user login
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body; // getting username and password from request
    const user = await User.findOne({ username });// finding username from database
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });// if user not in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });// if password not match in database
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

// new user registration
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;// getting username, email and password from request
    const usernameCheck = await User.findOne({ username });// finding username from database
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });// if username is already exist in database
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });// if email is already exist in database 
    const hashedPassword = await bcrypt.hash(password, 10); //hashing password using hashing method
    const user = await User.create({//creating user 
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

// getting users
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([//finding by id and by selecting particular values 
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);//return users
  } catch (ex) {
    next(ex);
  }
};

//setavtar
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;//getting id of user
    const avatarImage = req.body.image;// getting image
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
//user logout
module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
