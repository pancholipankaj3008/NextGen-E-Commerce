let express = require("express");
const { SignUp, Login, Logout } = require("../Controllers/UserController");

let UserRouter = express.Router();

UserRouter.post("/signup", SignUp);
UserRouter.post("/login", Login);
UserRouter.post("/logout", Logout);


module.exports=UserRouter;