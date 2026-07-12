let jwt = require("jsonwebtoken");

function Auth(...roles) {

    return (req, res, next) => {
        try {

            let token = req.cookies.accessToken;

            if (!token)
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized User"
                });

            let decoded = jwt.verify(token, process.env.ACCESS);

            if (!roles.includes(decoded.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized User"
                });
            }

            req.id = decoded.id;
            req.role = decoded.role;

            next();

        } catch (error) {

            if (error.name !== "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized User"
                });
            }

            try {

                const refreshToken = req.cookies.refreshToken;

                if (!refreshToken) {
                    return res.status(401).json({
                        success: false,
                        message: "Please login again"
                    });
                }

                let decoded = jwt.verify(refreshToken, process.env.REFRESH);

                if (!roles.includes(decoded.role)) {
                    return res.status(401).json({
                        success: false,
                        message: "Unauthorized User"
                    });
                }

                let newAccessToken = jwt.sign(
                    {
                        id: decoded.id,
                        role: decoded.role
                    },
                    process.env.ACCESS,
                    { expiresIn: "15m" }
                );

                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: false,      // localhost
                    sameSite: "lax",
                    maxAge: 15 * 60 * 1000
                });

                req.id = decoded.id;
                req.role = decoded.role;

                next();

            } catch (error2) {
                return res.status(401).json({
                    success: false,
                    message: "Please login again"
                });
            }
        }
    }
}

module.exports = { Auth };
