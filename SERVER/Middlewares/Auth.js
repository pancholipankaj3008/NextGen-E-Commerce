let jwt = require("jsonwebtoken");

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

function issueAccessToken(res, decoded) {
    const token = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.ACCESS, { expiresIn: "30m" });
    res.cookie("accessToken", token, { ...cookieOptions, maxAge: 30 * 60 * 1000 });
    return token;
}

function RefreshAccessToken(req, res) {
    try {
        const decoded = jwt.verify(req.cookies.refreshToken, process.env.REFRESH);
        issueAccessToken(res, decoded);
        return res.json({ success: true });
    } catch {
        return res.status(401).json({ success: false, message: "Please login again" });
    }
}

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

                issueAccessToken(res, decoded);

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

module.exports = { Auth, RefreshAccessToken };
