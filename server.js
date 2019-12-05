// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
var mongoose = require("mongoose");
var express = require("express");
var mongojs = require("mongojs");
const path = require("path");
// Initialize Express
var app = express();
var exphbs = require("express-handlebars");
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
MONGODB_URI =
  "mongodb://heroku_zkf3rs5q:7uvfsme3mhn9nk5vtpfbnnaffq@ds251618.mlab.com:51618/heroku_zkf3rs5q";
mongoose.connect(MONGODB_URI);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//Require axios call
var axios = require("./axios.js");

// Database configuration
var databaseUrl = "pitchforkdb";
var collections = ["musicnewsdata"];
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use("/", express.static(path.join(__dirname, "/public")));
// Hooking mongojs configuration to the db variable
var db = mongojs(MONGODB_URI, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});
var allDocuments = function(callback) {
  db.musicnewsdata.find({}, function(error, found) {
    if (error) {
      console.log(error);
    } else {
      callback(found);
    }
  });
};
// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  axios(function(response) {
    // console.log("calling?");
    // console.log(response);

    allDocuments(existingData => {
      response.forEach(element => {
        if (
          existingData.filter(document => document.link === element.link)
            .length == 0
        ) {
          element["comments"] = [];
          db.musicnewsdata.insert(element);
        }
      });
    });
    results = db.musicnewsdata.find({}, function(error, found) {
      if (error) {
        console.log(error);
      } else {
        res.render("index", { results: found });
      }
    });
  });
});

// TODO: make two more routes

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)
app.get("/all", function(req, res) {
  db.pitchforkdb.find({}, function(error, found) {
    if (error) {
      console.log(error);
    } else {
      res.json(found);
    }
  });
});
// Route 2
// =======
// app.get("/news", function(req, res) {
//   res.sendFile(path.join(__dirname + "/public/test.html"));
// });

// Adds comment section and adds comments to the database
app.post("/comments", function(req, res) {
  const identifier = req.body.link;
  const comment = "Anonymous said: " + req.body.comment;

  console.log(identifier);
  console.log(comment);
  console.log(req.body);
  db.musicnewsdata.update(
    { link: identifier },
    { $push: { comments: comment } }
  );
  res.json({ identifier, comment });
  // res.render("comment-page", { identifier, comment });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
