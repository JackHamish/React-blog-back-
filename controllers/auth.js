import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register user

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const isUsed = await User.findOne({ username });

        if (isUsed) {
            return res.json({
                message: `${username} alredy exist`,
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            password: hash,
        });

        const token = jwt.sign(
            {
                id: newUser._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        await newUser.save();

        res.json({ newUser, token, message: "Register success" });
    } catch (error) {
        res.json({ message: "Error register new user", error });
    }
};

//login user

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.json({ message: "Password is incorrect" });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.json({
            user,
            token,
            message: "login succes",
        });
    } catch (error) {
        res.json({ message: "login fail" });
    }
};

//get me

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(403).json({ message: "User not found" });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.json({ user, token });
    } catch (error) {
        res.status(403).json({ message: "forbidden" });
    }
};
