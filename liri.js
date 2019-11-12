require("dotenv").config();
var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var request = require("request");
var fs = require("fs");

var userInput = process.argv[2];
var userQuery = process.argv[3];

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
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log(
        "Command not recognized. Use 'concert-this', 'spotify-this', 'movie-this', or 'do-what-it-says'"
      );
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

function spotifyThisSong() {
  spotify.search({ type: "track", query: userQuery }, function(error, data) {
    if (error) {
      return console.log("Error occurred: " + error);
    }
    var artist = data.tracks.items[0].artists[0].name;
    var song = data.tracks.items[0].name;
    var album = data.tracks.items[0].album.name;
    var spotifyLink = data.tracks.items[0].external_urls.spotify;
    console.log(
      `Artist: ${artist}\nSong's name: ${song}\nAlbum: ${album}\nSpotify link: ${spotifyLink}`
    );
  });
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }

    var dataArr = data.split(",");

    userInput = dataArr[0];
    userQuery = dataArr[1];

    userCommand(userInput, userQuery);
  });
}
