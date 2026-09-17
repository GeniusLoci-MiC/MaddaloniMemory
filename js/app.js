// cards array holds all cards
let card = document.getElementsByClassName("card");
let cards = [...card];

// deck of all cards in game
const deck = document.getElementById("card-deck");

// declaring move variable
let moves = 0;
let counter = document.querySelector(".moves");

// declare variables for star icons
const stars = document.querySelectorAll(".scoreicon");

// stars list
let starsList = document.querySelectorAll(".stars li");

// declaring variable of matchedCards
let matchedCard = document.getElementsByClassName("match");

// close icon in modal
let closeicon = document.querySelector(".close");

// declare modal
let modal = document.getElementById("popup1")


function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}


// array for opened cards
var openedCards = [];

// @description shuffles cards
// @param {array}
// @returns shuffledarray
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

// children[0] is the front, children[1] is the back
function showBack(x) {
    x.children[0].style.width = "0%";
    x.children[0].style.height = "0%";

    x.children[1].style.width = "95%";
    x.children[1].style.height = "95%";
}

function showFront(x) {
    x.children[0].style.width = "95%";
    x.children[0].style.height = "95%";

    x.children[1].style.width = "0%";
    x.children[1].style.height = "0%";
}

// played on not matched second card
var badSounds = [];
var badSoundsCount = 7;

// played on matched second card
var goodSounds = [];
var goodSoundsCount = 1;

// seems unused
var joySounds = [];
var joySoundsCount = 5;

// played on first card
var trySounds = [];
var trySoundsCount = 7;

var taDaa;

// @description shuffles cards when page is refreshed / loads
// WARN! variabled after this point will not be initialized
document.body.onload = startGame();


function loadSounds()
{
    for(i = 1; i <= badSoundsCount; i++ )
    {
        url = "sounds/bad" + i + ".mp3";
        badSounds.push(new sound(url))
    }

    for(i = 1; i <= goodSoundsCount; i++ )
    {
        url = "sounds/good" + i + ".mp3";
        goodSounds.push(new sound(url))
    }

    for(i = 1; i <= joySoundsCount; i++ )
    {
        url = "sounds/joy" + i + ".mp3";
        joySounds.push(new sound(url))
    }

    for(i = 1; i <= trySoundsCount; i++ )
    {
        url = "sounds/try" + i + ".mp3";
        trySounds.push(new sound(url))
    }

    taDaa = new sound("sounds/tadaa.mp3");
}

function playRandomSound(x) {
    i = Math.floor(Math.random() * x.length);
    x[i].play();
}

// @description function to start a new play
function startGame(){

    loadSounds();

    // empty the openCards array
    openedCards = [];

    // shuffle deck
    cards = shuffle(cards);
    // remove all exisiting classes from each card
    for (var i = 0; i < cards.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove("show", "open", "match", "disabled");

        showBack(cards[i]);
    }
    // reset moves
    moves = 0;
    errors = 0;
    counter.innerHTML = moves;
    // reset rating
    for (var i= 0; i < stars.length; i++){
        // stars[i].style.color = "#FFD700";
        stars[i].style.visibility = "visible";
    }
    //reset timer
    second = 0;
    minute = 0;
    hour = 0;
    var timer = document.querySelector(".timer");
    timer.innerHTML = "Tempo: 0 min 0 secs";
    clearInterval(interval);
}


// @description toggles open and show class to display cards
var displayCard = function (){
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
    showFront(this);
};

// @description add opened cards to OpenedCards list and check if cards are match or not
function cardOpen() {
    openedCards.push(this);
    var len = openedCards.length;
    if(len === 2)
    {
        if(openedCards[0].type === openedCards[1].type)
        {
            matched();
        }
        else
        {
            unmatched();
        }

        moveCounter();
    }
    else // len === 1
    {
        playRandomSound(trySounds);
    }
};


// @description when cards match
function matched(){
    if(matchedCard.length < cards.length)
    {
        playRandomSound(goodSounds);
    }

    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open", "no-event");
    openedCards[1].classList.remove("show", "open", "no-event");
    openedCards = [];
}


// description when cards don't match
function unmatched(){
    disable();
    errors++;
    playRandomSound(badSounds);
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    
    setTimeout(function(){
        console.log("Entering timeout function in unmatched()");
        openedCards[0].classList.remove("show", "open", "no-event","unmatched");
        openedCards[1].classList.remove("show", "open", "no-event","unmatched");

        showBack(openedCards[0]);
        showBack(openedCards[1]);

        openedCards = [];
        enable();

    }, 1100);
}


// @description disable cards temporarily
function disable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.add('disabled');
    });
    removeCardsClickHandlers();
}


// @description enable cards and disable matched cards
function enable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.remove('disabled');
        for(var i = 0; i < matchedCard.length; i++){
            matchedCard[i].classList.add("disabled");
        }
    });
    addCardsClickHandlers();
}


// @description count player's moves
function moveCounter(){
    moves++;
    counter.innerHTML = moves;
    //start timer on first click
    if(moves == 1){
        second = 0;
        minute = 0;
        hour = 0;
        startTimer();
    }

    // setting rates based on moves
    // we have 24 cards, so the minimum moves are 12
    // X errors are possible, then every K errors you will lose a point
    penalties = (errors - 8) / 4;

    // always leave at least one point
    if(penalties > stars.length - 1)
    {
        penalties = stars.length - 1;
    }

    if(penalties < 0)
    {
        penalties = 0;
    }

    for(i = 0; i < stars.length; i++)
    {
        if (i < penalties) {
            // backward collapse, let's mirror the index
            stars[stars.length - i - 1].style.visibility = "collapse";
        }
    }
}


// @description game timer
var second = 0, minute = 0; hour = 0;
var timer = document.querySelector(".timer");
var interval;
function startTimer(){
    interval = setInterval(function(){
        timer.innerHTML = "Tempo: " + minute + " min " + second + " secs";
        second++;
        if(second == 60){
            minute++;
            second=0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    },1000);
}

// @description congratulations when all cards match, show modal and moves, time and rating
function congratulations(){
    if (matchedCard.length == cards.length)
    {
        // playRandomSound(joySounds);
        taDaa.play();
        clearInterval(interval);
        var minutiString = (minute == 1 ? " minuto " : " minuti ");
        var secondiString = (second == 1 ? " secondo" : " secondi");

        finalTime = minute + minutiString + " e " + second + secondiString;

        // show congratulations modal
        modal.classList.add("show");

        // declare star rating variable
        var starRating = document.querySelector(".stars").innerHTML;

        //showing move, rating, time on modal
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("starRating").innerHTML = starRating;
        document.getElementById("totalTime").innerHTML = finalTime;

        //closeicon on modal
        // closeModal();
    };
}

/*
// @description close icon on modal
function closeModal(){
    closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
        startGame();
    });
}
*/

// @desciption for user to play Again
function playAgain(){
    modal.classList.remove("show");
    startGame();
}

addCardsClickHandlers();

// loop to add event listeners to each card
function addCardsClickHandlers() {
    for (var i = 0; i < cards.length; i++){
        card = cards[i];
        card.addEventListener("click", displayCard);
        card.addEventListener("click", cardOpen);
        card.addEventListener("click", congratulations);
    }
}

function removeCardsClickHandlers() {
    for (var i = 0; i < cards.length; i++){
        card = cards[i];
        card.removeEventListener("click", displayCard);
        card.removeEventListener("click", cardOpen);
        card.removeEventListener("click", congratulations);
    }
}
