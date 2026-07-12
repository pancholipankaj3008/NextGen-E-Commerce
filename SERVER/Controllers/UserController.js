const User = require("../Models/User");
const bcrypt = require('bcrypt');
const { json } = require("express");
const saltRounds = 10;
let jwt = require("jsonwebtoken");


async function SignUp(req, res) {
    try {
        let { email, password } = req.body;

        let existUser = await User.findOne({ email });

        if (existUser) return res.status(409).json({ success: false, message: "User already exists" });

        bcrypt.hash(password, saltRounds, async function (err, hash) {
            if (err) return res.json({ success: false, message: err.message });

            let newUser = new User({ ...req.body, password: hash, role: "user" });

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

        if (!existUser) return res.status(404).json({ success: false, message: "User not found" });

        if (existUser.isBlocked) {
            return res.json({
                success: false,
                message: "Your account has been blocked"
            });
        }

        bcrypt.compare(password, existUser.password, function (err, result) {
            if (err) return res.json({ success: false, message: err.message });

            if (!result) return res.status(401).json({ success: false, message: "Invalid Password" });

            let accessToken = jwt.sign({
                id: existUser._id,
                role: existUser.role
            }, process.env.ACCESS, { expiresIn: '15m' });

            let refreshToken = jwt.sign({
                id: existUser._id,
                role: existUser.role
            }, process.env.REFRESH, { expiresIn: '7d' });

            const cookieOptions = {
                httpOnly: true,
                secure: false, // localhost
                sameSite: "lax",
            };

            res.cookie("accessToken", accessToken, {
                ...cookieOptions,
                maxAge: 15 * 60 * 1000,
            });

            res.cookie("refreshToken", refreshToken, {
                ...cookieOptions,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.json({
    success: true,
    message: "Login Successfully",
    user: {
        _id: existUser._id,
        name: existUser.name,
        email: existUser.email,
        role: existUser.role
    }
});

        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


async function Logout(req, res) {

    try {

        const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
};

res.clearCookie("accessToken", cookieOptions);
res.clearCookie("refreshToken", cookieOptions);

        res.json({ success: true, message: "Logout Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}





async function GetProfile(req, res) {
    try {
        let user = await User.findById(req.id).select("-password");
        if (!user) return res.json({ success: false, message: "User not found" });

        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

async function UpdateProfile(req, res) {
    try {

        let update = { ...req.body };

        delete update.password;
        delete update.avatar;
        delete update.role;
        delete update.email;
        if (update.dob === "") delete update.dob;

        let user = await User.findByIdAndUpdate(req.id, update, { new: true }).select("-password");

        res.json({ success: true, message: "Profile Updated", user });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

async function ChangePassword(req, res) {
    try {
        let { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Current and new password are required" });
        }

        if (String(newPassword).length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
        }

        let user = await User.findById(req.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, saltRounds);

        await user.save();

        res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function AddAddress(req, res) {

    try {

        let user = await User.findById(req.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        user.addresses.push(req.body);

        await user.save();

        let address = user.addresses[user.addresses.length - 1];

        res.status(201).json({
            success: true,
            message: "Address Added Successfully",
            address
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

async function UpdateAddress(req, res) {

    try {

        let { addressId } = req.params;

        let user = await User.findById(req.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        let address = user.addresses.id(addressId);

        if (!address) {

            return res.status(404).json({
                success: false,
                message: "Address not found"
            });

        }

        Object.assign(address, req.body);

        await user.save();

        res.json({
            success: true,
            message: "Address Updated Successfully",
            address
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}


async function RemoveAddress(req, res) {

    try {

        let { addressId } = req.params;

        let user = await User.findById(req.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        let address = user.addresses.id(addressId);

        if (!address) {

            return res.status(404).json({
                success: false,
                message: "Address not found"
            });

        }

        user.addresses.pull(addressId);

        await user.save();

        res.json({
            success: true,
            message: "Address Deleted Successfully",
            addressId
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}


async function GetWishlist(req, res) {

    try {

        let user = await User.findById(req.id)
            .populate("wishlist");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        res.json({
            success: true,
            totalItems: user.wishlist.length,
            wishlist: user.wishlist
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

async function AddToWishlist(req, res) {

    try {

        let { productId } = req.params;

        let user = await User.findById(req.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        let alreadyExists = user.wishlist.some(
            (id) => id.toString() === productId
        );

        if (alreadyExists) {

            return res.status(400).json({
                success: false,
                message: "Product already in wishlist"
            });

        }

        user.wishlist.push(productId);

        await user.save();

        let updatedUser = await User.findById(req.id)
            .populate("wishlist");

        let addedProduct = updatedUser.wishlist.find(
            (product) => product._id.toString() === productId
        );

        res.json({
            success: true,
            message: "Added to wishlist",
            product: addedProduct
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

async function RemoveWishlist(req, res) {

    try {

        let { productId } = req.params;

        let user = await User.findById(req.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        let exists = user.wishlist.some(
            (id) => id.toString() === productId
        );

        if (!exists) {

            return res.status(404).json({
                success: false,
                message: "Product not found in wishlist"
            });

        }

        user.wishlist.pull(productId);

        await user.save();

        res.json({
            success: true,
            message: "Removed from wishlist",
            productId
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}




async function CreateByAdmin(req, res) {
    try {
        let { email, password, role } = req.body;
        let existUser = await User.findOne({ email });

        if (existUser) return res.json({ success: false, message: "User already exists with this email" });

        bcrypt.hash(password, saltRounds, async function (err, hash) {
            if (err) return res.json({
                success: false,
                message: err.message
            });

            let newUser = new User({ ...req.body, password: hash });

            await newUser.save();

            res.json({ success: true, message: "User Created Successfully" });

        })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


async function GetAllUsers(req, res) {

    try {
        let users = await User.find();

        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }

}

async function DeleteUser(req, res) {
    try {
        let { id } = req.params;
        let user = await User.findById(id);

        if (!user) return res.json({ success: false, message: "User not found" });

        if (user.role === "admin") {
            return res.json({ success: false, message: "Admin user cannot be deleted" });
        }

        await User.findByIdAndDelete(id);

        res.json({ success: true, message: "User Deleted Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}



async function UpdateUserByAdmin(req, res) {

    try {

        let { id } = req.params;

        let user = await User.findById(id);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role === "admin") {
            return res.json({
                success: false,
                message: "Admin user cannot be blocked"
            });
        }


        if (req.body.password) {
            delete req.body.password;
        }

        await User.findByIdAndUpdate(id, req.body);

        res.json({
            success: true,
            message: "User Updated Successfully"
        });

    } catch (error) {

        res.json({
            success: false,
            message: error.message
        });

    }
};




async function BlockUser(req, res) {

    try {

        let { id } = req.params;

        let user = await User.findById(id);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isBlocked) {
            return res.json({
                success: false,
                message: "User already blocked"
            });
        }

        user.isBlocked = true;

        await user.save();

        res.json({
            success: true,
            message: "User Blocked Successfully"
        });

    } catch (error) {

        res.json({
            success: false,
            message: error.message
        });

    }
}




async function UnblockUser(req, res) {

    try {

        let { id } = req.params;

        let user = await User.findById(id);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.isBlocked) {
            return res.json({
                success: false,
                message: "User already unblocked"
            });
        }

        user.isBlocked = false;

        await user.save();

        res.json({
            success: true,
            message: "User Unblocked Successfully"
        });

    } catch (error) {

        res.json({
            success: false,
            message: error.message
        });

    }
}




async function UserAnalytics(req, res) {

    try {

        // total users
        let totalUsers = await User.countDocuments();

        // total admins
        let totalAdmins = await User.countDocuments({
            role: "admin"
        });

        // blocked users
        let blockedUsers = await User.countDocuments({
            isBlocked: true
        });

        // verified users
        let verifiedUsers = await User.countDocuments({
            isVerified: true
        });

        // users created in last 30 days
        let lastMonthUsers = await User.countDocuments({
            createdAt: {
                $gte: new Date(
                    new Date().setDate(new Date().getDate() - 30)
                )
            }
        });

        res.json({
            success: true,

            analytics: {
                totalUsers,
                totalAdmins,
                blockedUsers,
                verifiedUsers,
                lastMonthUsers
            }
        });

    } catch (error) {

        res.json({
            success: false,
            message: error.message
        });

    }
}




module.exports = { SignUp, Login, Logout, GetProfile, UpdateProfile, ChangePassword, AddAddress, UpdateAddress, RemoveAddress, AddToWishlist, RemoveWishlist, GetAllUsers, GetWishlist, CreateByAdmin, GetAllUsers, DeleteUser, UpdateUserByAdmin, BlockUser, UnblockUser, UserAnalytics };
