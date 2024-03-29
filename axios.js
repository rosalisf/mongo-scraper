// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

var axiosJson = function(callback) {
  // First, tell the console what server.js is doing after axios call

  // Making a request via axios for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
  axios.get("https://pitchfork.com/").then(function(response) {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var results = [];

    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $(".module__visual").each(function(i, element) {
      // Save the text of the element in a "title" variable
      var article = $(element)
        .text()
        .trim();

      // In the currently selected element, look at its child elements (i.e., its a-tags),
      // then save the values for any "href" attributes that the child elements may have
      var link = $(element)
        .children()
        .attr("href");

      // var image = $(element)
      //   .children("a")
      //   .children()
      //   .children();

      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
        article: article,
        link: "https://pitchfork.com" + link
        // image: image
      });
    });

    // Log the results once you've looped through each of the elements found with cheerio
    callback(results);
  });
};

module.exports = axiosJson;
