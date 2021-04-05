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

var streamedWeatherData = [];

app.get("/weather", function(req, res) {
res.render("weather", {weatherContent: weatherContent, streamedWeatherData:streamedWeatherData});
});
app.post("/weather", function(req, res) {
  var city = String(req.body.cityInput);
  const units = "imperial";
  const apiKey = "2772dd5b7e80a5b58de7f2713214959c";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&APPID=" + apiKey;
  https.get(url, function(response) {
    response.on("data", function(data) {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const city = weatherData.name;
        const wind = weatherData.wind.speed;
        const humidity = weatherData.main.humidity;
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        //res.write("<h1> The weather is " + weatherDescription + "<h1>")
        //streamedWeatherData.push("<h1> The weather is " + weatherDescription + "<h1>");
        streamedWeatherData.push("<h2> The weather is " + weatherDescription + ". <h2>" + "<h3>The Temperature in " + city + " " + " is " + temp + "°F and the wind speed is " + wind + "MPH with a current humidity of " + humidity + "%. <h3>" + "<img src=" + imageURL +">");
        //streamedWeatherData.push("<img src=" + imageURL +">");

        //res.send();
        res.render("weather", {weatherContent: weatherContent, streamedWeatherData:streamedWeatherData});
      });
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
})
