import Post from "../models/Post.js";
import Coment from "../models/Coment.js";

export const createComment = async (req, res) => {
    try {
        const { postId, coment } = req.body;

        if (!coment) {
            return res.json({ message: "empty coment" });
        }

        const newComent = new Coment({ coment });

        await newComent.save();

        try {
            await Post.findByIdAndUpdate(postId, {
                $push: { coments: newComent._id },
            });
        } catch (error) {
            res.json({ message: "fail push comment" });
        }

        res.json(newComent);
    } catch (error) {
        res.json({ message: "fail add comment" });
    }
};
