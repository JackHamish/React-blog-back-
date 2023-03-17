import Post from "../models/Post.js";
import Comment from "../models/Coment.js";
import User from "../models/User.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

//Create post

export const createPost = async (req, res) => {
    try {
        const { title, text } = req.body;
        const user = await User.findById(req.userId);

        if (req.files) {
            let fileName = Date.now().toString() + req.files.imageUrl.name;
            const __dirname = dirname(fileURLToPath(import.meta.url));
            req.files.imageUrl.mv(path.join(__dirname, "..", "uploads", fileName));

            const newPostWithImage = new Post({
                username: user.username,
                title,
                text,
                imageUrl: fileName,
                author: req.userId,
            });

            await newPostWithImage.save();
            await User.findByIdAndUpdate(req.userId, {
                $push: { posts: newPostWithImage },
            });

            return res.json(newPostWithImage);
        }

        const newPostWithoutImage = new Post({
            username: user.username,
            title,
            text,
            imageUrl: "",
            author: req.userId,
        });

        await newPostWithoutImage.save();

        await User.findByIdAndUpdate(req.userId, {
            $push: { posts: newPostWithoutImage },
        });

        return res.json(newPostWithoutImage);
    } catch (error) {
        res.json({ message: "Error when try add post" });
    }
};

//Update post

export const updatePost = async (req, res) => {
    try {
        const { title, text, id } = req.body;
        const post = await Post.findById(id);

        if (req.files) {
            let fileName = Date.now().toString() + req.files.imageUrl.name;
            const __dirname = dirname(fileURLToPath(import.meta.url));
            req.files.imageUrl.mv(path.join(__dirname, "..", "uploads", fileName));

            post.imageUrl = fileName || "";
        }

        post.title = title;
        post.text = text;

        await post.save();

        return res.json(post);
    } catch (error) {
        res.json({ message: "Error when try add post" });
    }
};

// Get all posts

export const getAll = async (req, res) => {
    try {
        const posts = await Post.find().sort("-createdAt");
        const popularPosts = await Post.find().limit(5).sort("views");

        if (!posts) {
            return res.json({ message: "Posts data is empty" });
        }

        res.json({ posts, popularPosts });
    } catch (error) {
        res.json({ message: "Error get all posts" });
    }
};

// Get  posts by id

export const getById = async (req, res) => {
    try {
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id },
            {
                $inc: { views: 1 },
            }
        );

        res.json(post);
    } catch (error) {
        res.json({ message: "Error get posts" });
    }
};

// Get my posts

export const getMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        const list = await Promise.all(
            user.posts.map((post) => {
                return Post.findById(post._id);
            })
        );

        if (!list) {
            return res.json({ message: "Posts data is empty" });
        }

        res.json(list.filter((e) => e !== null));
    } catch (error) {
        res.json({ message: "Error get all posts" });
    }
};

// delete  posts

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            res.json({ message: "Post is missing" });
        }

        await User.findByIdAndUpdate(req.userId, {
            $pull: { posts: req.params.id },
        });
        res.json({ message: "Post successful delete" });
    } catch (error) {
        res.json({ message: "Error delete posts" });
    }
};

// Get  post comments

export const getPostComments = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id);

        const list = await Promise.all(
            post.coments.map((coment) => {
                return Comment.findById(coment);
            })
        );

        res.json(list);
    } catch (error) {
        res.json({ message: "Error get comments" });
    }
};
