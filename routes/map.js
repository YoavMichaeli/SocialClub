var express = require("express");
var router = express.Router();
var path = require("path");
var db = require("../utils/handlers/user");
var group = require("../utils/handlers/group");
var formParser = require("../utils/form-parser");
const https = require('https');


router.get("/", function(req, res, next) {
  db.getAll((err, users) => {
    const uniqueCountries = [...new Set(users.map(user => user.country))];
    const countryLatLngMap = {};

    const getGeoData = (country, callback) => {
      console.log(country)
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${country}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          const parsedData = JSON.parse(data);
          callback(parsedData);
        });
      }).on("error", (err) => {
        console.log("Error: " + err.message);
        callback(null);
      });
    };

    let processedCountries = 0;
    uniqueCountries.forEach(country => {
      getGeoData(country, (geoData) => {
        if (geoData && geoData.results[0]) {
          const location = geoData.results[0].geometry.location;
          countryLatLngMap[country] = location;
          console.log(location)
        }
        processedCountries++;
        if (processedCountries === uniqueCountries.length) {
          proceedWithRendering();
        }
      });
    });

    function proceedWithRendering() {
      users = users.map(user => {
        const location = countryLatLngMap[user.country];
        console.log(location)
        return {
          ...user,
          lat: location ? location.lat : null,
          lng: location ? location.lng : null,
        };
      });
      
      group.getAll((err, groups) => {
        db.findById(req.session._id, (err, user) => {
          res.render("map", {
            userGroupsAdmin: user.groupsAdmin,
            title: req.app.conf.name,
            users: users,
            groups: groups, 
            apiKey: process.env.GOOGLE_MAPS_API_KEY
          });
        });
      });
    }
  });
});

function fetchWeatherData(country, callback) {
  const weatherstackEndpoint = `http://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_API_KEY}&query=${country}`;

  
  http.get(weatherstackEndpoint, (weatherResp) => {
      let weatherData = '';

      weatherResp.on('data', (chunk) => {
          weatherData += chunk;
      });

      weatherResp.on('end', () => {
          const parsedWeather = JSON.parse(weatherData);
          if (!parsedWeather.success && parsedWeather.error) {
              console.error("Weatherstack API error:", parsedWeather.error.info);
              callback(null);
          } else {
              const weather = {
                  temperature: parsedWeather.current.temperature,
                  description: parsedWeather.current.weather_descriptions[0],
                  localtime: parsedWeather.location.localtime,
                  locationName: parsedWeather.location.name
              };
              callback(weather);
          }
      });

  }).on("error", (err) => {
      console.log("Error fetching weather data: " + err.message);
      callback(null);
  });
}


module.exports = router;

