const jwt = require("jsonwebtoken");
const { fetchUserDetails } = require("../helper/fetch_user_details");
const secrete = process.env.secrete;

const auth = async (req, res, next) => {
  //get token from the header
  const token = req.header("x-auth-token");
  //Check if not token
  if (token == undefined) {
    return next(Error("Auth Token passed is undefined"));
  }
  if (!token) {
    return next(Error("Auth Token is invalid"));
  }
  const decoded = jwt.verify(token, secrete);
  req.uid = decoded.uid;
  let user = await fetchUserDetails(req.uid);
  if (user.data == null) {
    return next(Error("User Not found"));
  }
  req.user = user;
  console.log(process.platform);
  if (process.env.server == "dev") {
    console.log(req.url, ` [${new Date().toLocaleString()}]`);
  } else {
    let date = new Date(Date.now());
    let ist_date = date;
    ist_date.setHours(ist_date.getHours() + 5);
    ist_date.setMinutes(ist_date.getMinutes() + 30);
    console.log(req.url, ` [${ist_date.toLocaleString()}]`);
  }

  next();
};

module.exports = auth;
