const User = require("../Models/User");
const bcrypt = require('bcrypt');
const saltRounds = 10;
let jwt = require("jsonwebtoken");


async function SignUp(req, res) {
    try {
        let { email, password } = req.body;

        let existUser = await User.findOne({ email });

        if (existUser) return res.json({ success: false, message: "User already exists" });

        bcrypt.hash(password, saltRounds, async function (err, hash) {
            if (err) return res.json({ success: false, message: err.message });

            let newUser = new User({ ...req.body, password: hash });

            await newUser.save();

            res.json({ success: true, message: "User Registerd Successfully" });

        });


    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


async function Login(req, res) {
    try {
        let { email, password } = req.body;

        let existUser = await User.findOne({ email });

        if (!existUser) return res.json({ success: false, message: "User not found" });

        bcrypt.compare(password, existUser.password, function (err, result) {
            if (err) return res.json({ success: false, message: err.message });

            if (!result) return res.json({ success: false, message: "Invalid Password" });

            let accessToken = jwt.sign({
                id: existUser._id,
                role: existUser.role
            }, process.env.ACCESS, { expiresIn: '15m' });

            let refreshToken = jwt.sign({
                id: existUser._id,
                role: existUser.role
            }, process.env.REFRESH, { expiresIn: '7d' });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                maxAge: 15 * 60 * 1000
            })

            res.json({ success: true, message: "Login Successfully" });

        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


async function Logout(req, res) {

    try {

        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");

        res.json({ success: true, message: "Logout Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

async function GetProfile(req, res) {
    try {
        let user = await User.findById(req.id);

        if (!user) return res.json({ success: false, message: "User not found" });

        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

async function UpdateProfile(req, res) {
    try {

        await User.findByIdAndUpdate(req.id, req.body);

        res.json({success: true, message: "Profile Updated"});

    } catch (error) {
        res.json({success: false,message: error.message});
    }
}





module.exports = { SignUp, Login, Logout, GetProfile, UpdateProfile };