require("dotenv").config();
var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var request = require("request");
var fs = require("fs");

var userInput = process.argv[2];
var userQuery = process.argv[3].replace("-", "");

var moment = require("moment");

function userCommand(userInput, userQuery) {
  switch (userInput) {
    case "concert-this":
      concertThis();
      break;
    case "spotify-this":
      spotifyThisSong();
      break;
    case "movie-this":
      movieThis();
      break;
    case "do-this":
      doThis(userQuery);
      break;
  }
}
userCommand(userInput, userQuery);

function concertThis() {
  request(
    "https://rest.bandsintown.com/artists/" +
      userQuery +
      "/events?app_id=codingbootcamp",
    function(error, response, body) {
      var userBand = JSON.parse(body);
      var numOfConcerts = Object.keys(userBand).length;
      if (numOfConcerts > 0) {
        console.log(
          `\nThere are ${numOfConcerts} upcoming concerts of ${userBand[0].artist.name} \n-------------------------------------------------------`
        );
        for (i = 0; i < numOfConcerts; i++) {
          console.log(`Concert venue: ${userBand[i].venue.name}`);
          console.log(`Venue location: ${userBand[i].venue.city}`);
          console.log(
            `Date of the event: ${moment(userBand[i].datetime).format(
              "MM/DD/YYYY"
            )}\n`
          );
        }
      } else {
        console.log("\nNo concerts found.");
      }
    }
  );
}
