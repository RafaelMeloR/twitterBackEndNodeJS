const express = require("express");
const {
  createTweet,
  fetchAllTweets,
  fetchTweetById,
  updateTweet,
  deleteTweet,
} = require("../controllers/tweet_controller");
const { uploads } = require("../helper/uploads");
const { errorHandler } = require("../helper/error_handler");
const auth = require("../middlewares/auth");
const router = express.Router();
router.post("/", auth, uploads.none(), errorHandler(createTweet));
router.get("/", auth, uploads.none(), errorHandler(fetchAllTweets));
router.get("/:tid", auth, uploads.none(), errorHandler(fetchTweetById));
router.put("/:tid", auth, uploads.none(), errorHandler(updateTweet));
router.delete("/:tid", auth, uploads.none(), errorHandler(deleteTweet));
// router.post("/google-signup", uploads.none(), errorHandler(googleSignUp));
// router.post("/login", uploads.none(), errorHandler(login));
// router.post("/google-login", uploads.none(), errorHandler(googleLogin));
// router.get("/getprofile", auth, uploads.none(), errorHandler(getprofile));

module.exports = router;
