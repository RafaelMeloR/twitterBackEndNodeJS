// const User = require("../models/user");
const Tweet = require("../models/tweet");
const { MESSAGES } = require("../helper/messages");
const tweet = require("../models/tweet");
const { ObjectId } = require("mongoose").Types;

const createTweet = async (req, res, next) => {
  try {
    const { title, body, image } = req.body;
    if (!title || !body) {
      return next(Error(MESSAGES.TITLE_BODY_MISSING));
    }
    const tweet = new Tweet({
      title: title.trim(),
      author: req.user.data._id,
      body: body.trim(),
      image: image.trim(),
    });
    let result = await tweet.save();
    console.log(result);
    if (!result) {
      return next(Error(MESSAGES.TWEET_FAILURE));
    }
    return res.status(200).json({ message: MESSAGES.TWEET_SUCCESS });
  } catch (error) {
    console.log("Error", error.message);
    return next(Error(`Internal server error ${error.message} ${req.user}`));
  }
};

const fetchAllTweets = async (req, res, next) => {
  try {
    let userId = req.user.data._id;
    if (!ObjectId.isValid(userId)) {
      return next(Error("Permission Denied"));
    }
    let tweet = await Tweet.find({ author: userId })
      .populate({
        path: "author",
        select: "name username email profile_image",
      })
      .exec();
    if (!tweet) {
      return next(Error(MESSAGES.EMPTY_TWEETS));
    }
    return res.status(200).json({ data: tweet });
  } catch (error) {
    return next(Error(`${error.message}`));
  }
};

const fetchTweetById = async (req, res, next) => {
  try {
    console.log(req.params);
    let tweet_id = req.params.tid;
    let userId = req.user.data._id;
    if (!ObjectId.isValid(tweet_id)) {
      return next(Error("Tweet not found"));
    }
    let tweet = await Tweet.findOne({ _id: tweet_id, author: userId })
      .populate({
        path: "author",
        select: "name username email profile_image",
      })
      .exec();
    if (!tweet) {
      return next(Error(MESSAGES.EMPTY_TWEETS));
    }
    return res.status(200).json({ data: tweet });
  } catch (error) {
    return next(Error(`${error.message}`));
  }
};

const updateTweet = async (req, res, next) => {
  try {
    let tweet_id = req.params.tid;
    let userId = req.user.data._id;
    delete req.body["author"];
    console.log(req.body.title, req.body);
    if (!ObjectId.isValid(tweet_id)) {
      return next(Error("Tweet not found"));
    }
    let result = await Tweet.findOneAndUpdate(
      { _id: tweet_id, author: userId },
      { $set: req.body }
    );
    if (!result) {
      return next(Error("Unable to edit tweet"));
    }
    return res.status(200).json({ message: "Tweet updated" });
  } catch (error) {
    return next(Error(`${error.message}`));
  }
};

const deleteTweet = async (req, res, next) => {
  try {
    let tweet_id = req.params.tid;
    let userId = req.user.data._id;
    if (!ObjectId.isValid(tweet_id)) {
      return next(Error("Tweet not found"));
    }
    let result = await Tweet.findOneAndDelete({
      _id: tweet_id,
      author: userId,
    });
    if (!result) {
      return next(Error("Unable to delete"));
    }
    return res.status(200).json({ message: "Tweet deleted" });
  } catch (error) {
    return next(Error(`${error.message}`));
  }
};

module.exports = {
  createTweet,
  fetchAllTweets,
  fetchTweetById,
  updateTweet,
  deleteTweet,
};
