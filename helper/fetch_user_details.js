const User = require("../models/user");
const { ObjectId } = require("mongoose").Types;

const fetchUserDetails = async (_id) => {
  return new Promise(async (resolve, reject) => {
    if (!ObjectId.isValid(_id)) {
      resolve({ message: "User ID is not Valid", data: null });
    }
    let user = await User.findById(_id).select("-password -__v").exec();
    if (!user) {
      resolve({ message: "User not found", data: null });
    }
    resolve({ message: "User Found", data: user });
  });
};

module.exports = { fetchUserDetails };
