import { Router } from "express";

import { checkAuth } from "../utils/checkAuth.js";
import { createComment } from "../controllers/coment.js";

const router = new Router();

//Create coment

router.post("/:id", checkAuth, createComment);

export default router;
