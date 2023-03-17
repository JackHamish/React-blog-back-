import jwt from "jsonwebtoken";

export const checkAuth = async (req, res, next) => {
    const token = req.headers.authorization?.replace(/Bearer\s?/, "");

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.userId = decoded.id;

            next();
        } catch (error) {
            return res.json({ message: "Auth error" });
        }
    } else {
        return res.status(403).json({ message: "invalid auth token" });
    }
};
