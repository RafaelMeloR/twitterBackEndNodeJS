const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const tweetSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
    likes: { type: Number, default: 0 },
    image_url: { type: String },
    status: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tweet", tweetSchema);
