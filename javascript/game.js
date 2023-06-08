//variables
const buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var randomChosenColour;

var flagGameStarted = true;
var level = 0;

//pressing a key for starting the game (app is listening for keypress event)
$(document).keypress(function () {
    if (Boolean(flagGameStarted)) {
        $("h1").html("Level " + level);
        nextSequence();
        flagGameStarted = false;
    }
});

//when the user has to generate the right sequence (app is listening for button-clicked events)
$(".btn").click(function () {
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);

    makeSound(userChosenColour);
    animatePress(userChosenColour);

    console.log(`userClickedPattern : ${userClickedPattern}`);
    checkAnswer(userClickedPattern.length - 1);
});

//choosing a random colour from the buttonColours[] array and save it to the gamepattern[] array
function nextSequence() {
    //every time there is a level up, we empty "userClickedPattern[]" array
    userClickedPattern.length = 0;
    level++;
    $("h1").html("Level " + level);

    const min = 0;
    const max = 3;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    randomChosenColour = buttonColours[randomNumber];

    //making the random button to flash and making a sound
    //make the button with the appropriate #id to animate
    var flashSelector = $("#" + randomChosenColour);
    flashSelector.fadeTo(200, 0.1, function () {
        $(this).fadeTo(200, 1.0, function () {
            makeSound(randomChosenColour);
        });
    });

    gamePattern.push(randomChosenColour);
    console.log(`gamePattern : ${gamePattern}`);
}

//Checking if the user chooses the right answer by comparing the 2 arrays
function checkAnswer(currentLevel) {
    //checking if the user's choice equals with the app's choice
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        console.log("Success!");
        //if all user's choices are correct then level up and produce next sequence
        if (compareArrays(gamePattern, userClickedPattern)) {
            setTimeout(() => {
                console.log(`Level = ${level}`);
                nextSequence();
            }, 1000);
        }
    } else {
        console.log("Wrong answer.")
        makeSound("wrong");
        animateWrong("game-over");
        $("h1").html("Game Over, Press Any Key to Restart");
        restartGame();
    }
}

function restartGame() {
    level = 0;
    flagGameStarted = true;
    gamePattern.length = 0;
    userClickedPattern.length = 0;
}

function makeSound(colour) {
    var audio = new Audio(`sounds/${colour}.mp3`);
    audio.play();
}

//adding the class .pressed to the user's clicked button and removing it after 100ms
function animatePress(currentColour) {
    var chosenButton = $("#" + currentColour);
    chosenButton.addClass("pressed");
    setTimeout(() => {
        chosenButton.removeClass("pressed");
    }, 100);
}
//adding the class .game-over to the body element and removing it after 200ms
function animateWrong(className) {
    var wrongAnswerAnimation = $("body");
    wrongAnswerAnimation.addClass(className);
    setTimeout(() => {
        wrongAnswerAnimation.removeClass(className);
    }, 200);
}

function compareArrays(a, b) {
    //choosing this approach because there is no way to have null and/or undefined values in our arrays
    return JSON.stringify(a) === JSON.stringify(b);
}