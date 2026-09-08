import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Authentication required."
            });
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({
                message: "Invalid or expired session."
            });
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });

            return res.status(401).json({
                message: "User account not found. Please sign in again."
            });
        }

        req.userId = user._id;
        next();
    } catch (error) {
        console.error("Authentication middleware error:", error);

        return res.status(500).json({
            message: "Authentication failed."
        });
    }
};

export default isAuth;