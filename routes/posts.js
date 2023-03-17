import { Router } from "express";

import { checkAuth } from "../utils/checkAuth.js";
import {
    createPost,
    getAll,
    getById,
    getMyPosts,
    deletePost,
    updatePost,
    getPostComments,
} from "../controllers/posts.js";

const router = new Router();

//Create post

router.post("/", checkAuth, createPost);

//Get all posts

router.get("/", getAll);

//Get  posts by id

router.get("/:id", getById);

//Update posts

router.put("/:id", checkAuth, updatePost);

//Get  my posts

router.get("/user/me", checkAuth, getMyPosts);

//Delete posts by id

router.delete("/:id", checkAuth, deletePost);

//get posts comments

router.get("/coments/:id", getPostComments);

export default router;
