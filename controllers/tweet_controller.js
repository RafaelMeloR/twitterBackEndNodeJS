const { MESSAGES } = require("../helper/messages");
const {
  createTweetDB,
  fetchAllTweetDB,
  fetchTweetByIdDB,
  updateTweetDB,
  deleteTweetDB,
} = require("../database/tweet");
const { ObjectId } = require("mongoose").Types;

const createTweet = async (req, res, next) => {
  try {
    const { title, body, image } = req.body;
    if (!title || !body) {
      return next(Error(MESSAGES.TITLE_BODY_MISSING));
    }

    const tweet = {
      title: title.trim(),
      author: req.user.data._id,
      body: body.trim(),
      image: image.trim(),
    };
    let result = await createTweetDB(tweet);
    if (!result.status) {
      return next(Error(result.error));
    }
    return res
      .status(200)
      .json({ message: MESSAGES.TWEET_SUCCESS, data: result.data });
  } catch (error) {
    return next(Error(` ${error.message}`));
  }
};

const fetchAllTweets = async (req, res, next) => {
  try {
    let userId = req.user.data._id;
    if (!ObjectId.isValid(userId)) {
      return next(Error(MESSAGES.PERMISSION_DENIED));
    }
    let tweet = await fetchAllTweetDB(userId);
    if (!tweet.status) {
      return next(Error(tweet.error));
    }
    return res.status(200).json({ data: tweet.data });
  } catch (error) {
    return next(Error(`${error.message}`));
  }
};

const fetchTweetById = async (req, res, next) => {
  try {
    let tweet_id = req.params.tid;
    let userId = req.user.data._id;
    if (!ObjectId.isValid(tweet_id)) {
      return next(Error(MESSAGES.TWEET_NOT_FOUND));
    }
    let tweet = await fetchTweetByIdDB(tweet_id, userId);
    if (!tweet.status) {
      return next(Error(MESSAGES.EMPTY_TWEETS));
    }
    return res.status(200).json({ data: tweet.data });
  } catch (error) {
    return next(Error(`${error.message}`));
  }
};

const updateTweet = async (req, res, next) => {
  try {
    let tweet_id = req.params.tid;
    let userId = req.user.data._id;
    delete req.body["author"];
    if (!ObjectId.isValid(tweet_id)) {
      return next(Error(MESSAGES.TWEET_NOT_FOUND));
    }
    let result = await updateTweetDB(tweet_id, userId, req.body);
    if (!result.status) {
      return next(Error(result.error));
    }
    return res.status(200).json({ message: MESSAGES.TWEET_UPDATE_SUCCESS });
  } catch (error) {
    return next(Error(`${error.message}`));
  }
};

const deleteTweet = async (req, res, next) => {
  try {
    let tweet_id = req.params.tid;
    let userId = req.user.data._id;
    if (!ObjectId.isValid(tweet_id)) {
      console.log(MESSAGES.TWEET_NOT_FOUND);
      return next(Error(MESSAGES.TWEET_NOT_FOUND));
    }
    let result = await deleteTweetDB(tweet_id, userId);
    if (!result.status) {
      console.log(result.error);
      return next(Error(result.error));
    }
    return res.status(200).json({ message: MESSAGES.TWEET_DELETE_SUCCESS });
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
