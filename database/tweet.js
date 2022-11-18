const { MESSAGES } = require("../helper/messages");
const Tweet = require("../models/tweet");

const createTweetDB = async (tweet) => {
  try {
    const { title, author, body, image } = tweet;
    const data = new Tweet({
      title: title.trim(),
      author: author,
      body: body.trim(),
      image: image.trim(),
    });
    let result = await data.save();
    if (!result) {
      throw { status: false, error: MESSAGES.TWEET_FAILURE };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const fetchAllTweetDB = async (author) => {
  try {
    let result = await Tweet.find({ author })
      .populate({
        path: "author",
        select: "name username email profile_image",
      })
      .exec();
    if (!result) {
      return { status: false, error: MESSAGES.EMPTY_TWEETS };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const fetchTweetByIdDB = async (tweet_id, author) => {
  try {
    let result = await Tweet.findOne({ _id: tweet_id, author })
      .populate({
        path: "author",
        select: "name username email profile_image",
      })
      .exec();
    if (!result) {
      return { status: false, error: "unable to fetch tweet" };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const updateTweetDB = async (tweet_id, author, data) => {
  try {
    let result = await Tweet.findOneAndUpdate(
      { _id: tweet_id, author },
      { $set: data }
    );
    if (!result) {
      return { status: false, error: MESSAGES.TWEET_UPDATE_SUCCESS };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const deleteTweetDB = async (tweet_id, author) => {
  try {
    let result = await Tweet.findOneAndDelete({
      _id: tweet_id,
      author: userId,
    });
    if (!result) {
      return { status: false, error: MESSAGES.TWEET_DELETE_FAILURE };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

module.exports = {
  createTweetDB,
  fetchAllTweetDB,
  fetchTweetByIdDB,
  updateTweetDB,
  deleteTweetDB,
};
