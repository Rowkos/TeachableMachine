// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using a pre-trained customized model and p5.js
This example uses p5 preload function to create the classifier
=== */

// gameplan.
// score last five moves.


// Classifier Variable
let classifier;
// Model URL
let imageModelURL = "https://teachablemachine.withgoogle.com/models/I2MOTZBZ_/";

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let currentFace = -1;
let evaluate = false;

let recentRolls = [];

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  var canvas = createCanvas(500, 400);
  canvas.parent("sketchholder");
  // Create the video
  video = createCapture(VIDEO);
  video.size(500, 375);
  video.hide();

  flippedVideo = ml5.flipImage(video)
  // Start classifying
  classifyVideo();
}

function myFunction()
{
  evaluate = true;
}

function draw() {
  background(0);
  // Draw the video
  image(flippedVideo, 0, 0);


  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text("current face detected: " + label.toString(), width / 2, height - 4);
  document.getElementById('rolls').innerHTML = recentRolls.toString().replaceAll(",", " + ");
  // use a threshold of confidence instead
  currentFace = label;
  document.querySelector('#resetbutton').hidden = true;

  if(recentRolls.length == 5)
  {
    document.getElementById('announcement').innerHTML =
        "your best play is: " + scoreHand();
    document.querySelector('#resetbutton').hidden = false;
    // add a button that resets recent rolls

    var highest_score = -1;
  }

  else if (evaluate)
  {
    evaluate = false;
    recentRolls.push(parseInt(label));

  }
}

function scoreHand()
{
  let counts = countElements();
  print(counts);
  let scores= {
    "Ones": counts[0],
    "Twos": counts[1] * 2,
    "Threes": counts[2] * 3,
    "Fours": counts[3] * 4,
    "Fives": counts[4] * 5,
    "Sixes": counts[5] * 6,
    "Three Of A Kind": checkThreeOfAKind(counts),
    "Four Of A Kind": checkFourOfAKind(counts),
    "Full House": checkFullHouse(counts),
    "Small Straight": checkSmallStraight(),
    "Large Straight": checkLargeStraight(),
    "Yahtzee": checkYahtzee(counts),
    "Chance": getSumOfRolls()
  };

  return getHighestValue(scores);
}

function getHighestValue(scores)
{
  var bestScore = 0;
  var bestScoreIndex;
  for(var key in scores)
  {
    if(scores[key] > bestScore)
    {
      bestScore = scores[key];
      bestScoreIndex = key;
    }
  }
  return bestScoreIndex;
}

function countElements()
{
  const counts = [];
  for (let i = 0; i < 6; i++) {
    var counter = 0;
    for (let j = 0; j < recentRolls.length; j++) {
      if (recentRolls[j] == (i + 1)) {
        counter += 1;
      }
    }
    counts.push(counter);
  }
  return counts;
}

function checkThreeOfAKind(counts)
{
  if (counts.includes(3)) {
    return getSumOfRolls();
  }
  return -1;
}

function checkFourOfAKind(counts)
{
  if (counts.includes(4)) {
    return getSumOfRolls();
  }
  return -1;
}

function checkFullHouse(counts)
{
  if (counts.includes(2) && counts.includes(3)) {
    return 25;
  }
  return -1;
}

function getLengthOfStraight()
{
  let sortedList = recentRolls.sort()
  var currentLength = 1;
  var prevNum = sortedList[0];
  for(let i = 1; i < sortedList.length; i++) {
    if(sortedList[i] == (prevNum + 1))
    {
      currentLength += 1;
      prevNum = sortedList[i];
    }
    else{
      currentLength = 1;
      prevNum = sortedList[i];
    }
  }
  return currentLength;
}
function checkSmallStraight()
{
  currentLength = getLengthOfStraight();
  if(currentLength == 4)
  {
    return 30;
  }
  return -1;
}

function checkLargeStraight()
{
  currentLength = getLengthOfStraight();
  if(currentLength == 5)
  {
    return 40;
  }
  return -1;
}

function checkYahtzee(counts)
{
  if (counts.includes(5)) {
    return 50;
  }
  return -1;
}

function getSumOfRolls()
{
  var counter = 0;
  for (let i = 0; i < recentRolls.length; i++) {
    counter += recentRolls[i];
  }
  return counter;
}
function resetRolls()
{
  recentRolls = [];
  document.getElementById('announcement').innerHTML =
        "";
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  // Classifiy again!
  classifyVideo();


}
function gotSources(sources) {
  for (var i = 0; i !== sources.length; ++i) {
    if (sources[i].kind === 'audio') {
      console.log('audio: '+sources[i].label+' ID: '+sources[i].id);
    } else if (sources[i].kind === 'video') {
      console.log('video: '+sources[i].label+' ID: '+sources[i].id);
    } else {
      console.log('Some other kind of source: ', sources[i]);
    }
  }
}