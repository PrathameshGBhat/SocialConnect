import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser); //grab user using the particular id from DB
router.get("/:id/friends", verifyToken, getUserFriends); //grab user's friends from DB

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend); //add or remove friends

export default router;
