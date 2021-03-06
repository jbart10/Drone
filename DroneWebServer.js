var arDrone = require('ar-drone');
var path = require('path');
var express = require('express');
var fs = require('fs');

var client = arDrone.createClient({ip: '192.168.1.25'});
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// This router is sending a command to the drone
// to take off
app.get('/takeoff', function(req, res) {
  client.takeoff();
  console.log("Drone Taking Off");
});

// This router is sending a command to the drone
// to land
app.get('/land', function(req, res) {
  client.stop(0);
  client.land();
  console.log("Drone Landing");
});

// This router is sending a command to the drone
// to calibrate. Causes the drone to fully
// rotate and balance
app.get('/calibrate', function(req, res) {
  client.calibrate(0);
  console.log("Drone Calibrating");
});

// This router is sending a command to the drone
// to cancel all existing commands. Important if
// turning clockwise and you want to stop for
// example
app.get('/hover', function(req, res) {
   client.stop(0);
   console.log("Hover");
});

// function to capture the photos
app.get('/photos', function(req, res) {
  console.log("Drone Taking Pictures");
  var pngStream = client.getPngStream();
  var period = 2000; // Save a frame every 2000 ms.
  var lastFrameTime = 0;

  pngStream
    .on('error', console.log)
    .on('data', function(pngBuffer) {
      var now = (new Date()).getTime();
      if (now - lastFrameTime > period) {
        lastFrameTime = now;
          fs.writeFile(__dirname + '/public/DroneImage.png', pngBuffer, function(err) {
          if (err) {
            console.log("Error saving PNG: " + err);
          } else {
            console.log("Saved Frame");
          }
        });
      }
   });
});

// This router is sending a command to the drone
// to turn clockwise
app.get('/clockwise', function(req, res) {
   client.clockwise(0.5);
   console.log("Drone Turning Joe Clockwise");
});

app.listen(3000, function () {
});
