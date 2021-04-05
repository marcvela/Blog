//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

// required to access the Weather API
const https = require("https");

const homeStartingContent = "Introductory content for my blog. This is the starting page for my daily journal.";
const aboutContent = "This page describes what the blog is all about and some information about myself.";
const contactContent = "Brief information about how to contact me via social media.";
const weatherContent = "This is the weather page. It provides information about the weather after submitting a City Name in the box.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

// need to write out an app.get function that open a route /weather Need an EJS view called weather.ejs that displays one text field to input city name
app.get("/weather", function(req, res) {
  res.render("weather", {weatherContent: weatherContent});
});
app.post("/weather", function(req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  weatherPost.push(post);
  res.redirect("/weather");
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});

// need to write out an app.get function that open a route /weather Need an EJS view called weather.ejs that displays one text field to input city name
//This EJS view will input a city name from user
// Then need to write out an app.get function that will use the city name to query the Weather API to retrieve basic weather information - temperature, description and humidity
// The display of the weather information must be saved to an array and then the results of the array must be pushed to the /weather EJS view to display
// The /weather route and page created by weather.ejs page should allow for the input of the city name, and the display of the weather for the city - city name, weather icon image, temperature in F, description, humidity, wind direction
  var cityID = String(req.body.cityIDInput);
  console.log(req.body.cityIDInput)
  const units = "imperial";
  const apiKey = "2772dd5b7e80a5b58de7f2713214959c";
  const url = "https://api.openweathermap.org/data/2.5/weather?id=" + cityID + "&units=" + units + "&APPID=" + apiKey;

  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const city = weatherData.name;
      const wind = weatherData.wind.speed;
      const humidity = weatherData.main.humidity;
      const clouds = weatherData.clouds.all;
      const windDir = weatherData.wind.deg;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.render("<h1> The weather is " + weatherDescription + ".<h1>");
      res.render("<h2>The Temperature in " + city + " " + " is " + temp + "°F and the wind speed is " + wind + "MPH. The wind direction is " + windDir + "° and the cloud level is " + clouds + "%.<h2>");
      res.render("<img src=" + imageURL + ">");
    });
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
