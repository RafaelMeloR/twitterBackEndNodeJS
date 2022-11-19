require("dotenv").config();
const User = require("../models/user");
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const app = require("../app");
chai.use(chaiHttp);
const jwt = require("jsonwebtoken");
const secrete = process.env.secrete;
require("../helper/db");

const loginCreds = {
  username: "bluedevil",
  password: "31031999",
};

let token;

describe("CRUD API", () => {
  it("it should login, create a post, Update a Post, Delete a post", (done) => {
    chai
      .request(app)
      .post("/api/auth/login")
      .field("username", loginCreds.username)
      .field("password", loginCreds.password)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("token");
        token = res.body.token;
        const decoded = jwt.verify(token, secrete);
        console.log("DECODED", decoded.uid);
        chai
          .request(app)
          .post("/api/tweet")
          .set({ "x-auth-token": token })
          .field("title", "New Title")
          .field("body", "new body")
          .field("image", "new Image")
          .end((err, res) => {
            res.should.have.status(200);
            let tweet_id = res.body.data._id;
            console.log("TWEET ID", tweet_id);
            chai
              .request(app)
              .put("/api/tweet/" + tweet_id)
              .set({ "x-auth-token": token })
              .field("title", "new test title")
              .field("body", "new test body")
              .end((err, res) => {
                res.should.have.status(200);
                chai
                  .request(app)
                  .delete("/api/tweet/" + tweet_id)
                  .set({ "x-auth-token": token })
                  .end((err, res) => {
                    res.should.have.status(200);
                    done();
                  });
              });
          });
      });
  });
});

describe("Sign Up API", () => {
  afterEach((done) => {
    console.log("After Each running");
    User.findOneAndDelete({ username: "someone" }, (err) => {
      done();
    });
  });
  it("It should sign UP", (done) => {
    chai
      .request(app)
      .post("/api/auth/signup")
      .field("name", "jerry")
      .field("username", "someone")
      .field("email", "jerr@gmail.com")
      .field("password", "1234567")
      .field("dob", "03/31/1999")
      .field("phone_no", "9361960789")
      .field("gender", "male")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        // res.body.should.have.property("message");
        done();
      });
  });
});

// describe("After Each", async () => {

// });

// describe("Books", () => {
//   beforeEach((done) => {
//     //Before each test we empty the database
//     Book.remove({}, (err) => {
//       done();
//     });
//   });
//   /*
//    * Test the /GET route
//    */
//   describe("/GET book", () => {
//     it("it should GET all the books", (done) => {
//       chai
//         .request(server)
//         .get("/book")
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a("array");
//           res.body.length.should.be.eql(0);
//           done();
//         });
//     });
//   });
// });
