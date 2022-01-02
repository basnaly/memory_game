
let countPhotos = 6; // max pairs of photos to know that game was over
let countOpenCards = 0; // set amount of open cards = 0 to avoid opening more than 2 cards in same time
let firstCity; // set variable firstCity to compare if photo first = second (hide them) or not (close them)
let gameStart = 0;

const IMAGES = {
'Berlin': ["img/Berlin-1.jpeg", "img/Berlin-2.jpeg", "img/Berlin-3.jpeg",
           "img/Berlin-4.jpeg", "img/Berlin-5.jpeg", "img/Berlin-6.jpeg"],
'London': ["img/London-1.jpeg", "img/London-2.jpeg", "img/London-3.jpeg",
           "img/London-4.jpeg", "img/London-5.jpeg", "img/London-6.jpeg"],
'Paris': ["img/Paris-1.jpeg", "img/Paris-2.jpeg", "img/Paris-3.jpeg",
          "img/Paris-4.jpeg", "img/Paris-5.jpeg", "img/Paris-6.jpg"],
'Rome': ["img/Rome-1.jpeg", "img/Rome-2.jpeg", "img/Rome-3.jpeg",
         "img/Rome-4.jpeg", "img/Rome-5.jpeg", "img/Rome-6.jpeg"],
}

//select city
const inCitySelection = () => {
    $(".title-photos").click(function () {  // click on photo to select city
        $(".choice-page").hide(1000); // hide choice-page
        $(".game-page").show(1000); // show game-page
        let cityChoice = $(this).children("img"); // take the image of chosen city and save in in variable cityChoice
        //this is a click
        let cityId = $(cityChoice[0]).attr("id"); // save id of this image in variable cityId to pass them for generate
        resetGame(); // reset all the variables in resetGame() func
        generateGame(cityId); // generate game according to city id
    });    
}

const resetGame = () => {
    $(".card").fadeTo(200, 1).css("pointer-events", "unset"); //return all cards, remove blocking click
    $(".card-cover").fadeTo(200, 1); //return all card's covers
    countPhotos = 6; // return 6 pair of photos
    firstCity = 0; // reset to 0
}

const generateGame = cityId => {
    let fullArr = [...IMAGES[cityId], ...IMAGES[cityId]]; // copy arr of IMAGES twice to create arr of 12 photoes
    fullArr.sort(() => (Math.random() > .5) ? 1 : -1); // random sort of photos using 50% of probability
    let cityImg = $(".city-img"); // get HTML elements of photos
    for (let i = 0; i < cityImg.length; i++) { // and travers in loop for
        $(cityImg[i]).attr("src", fullArr[i]); // put the images on each card; 
    }
};

const getIdImage = self => {
    let curentImg = $(self).children(".city-img")[0]; //get current img element for compare with other cards 
    let secondCity = $(curentImg).attr("src"); //get path of the image and save it on secondCity
    return secondCity;
}

const openCardAnimation = self => {
    $(self).children(".card-cover").animate({
        height: ["toggle", "swing"],
    }, 400); //remove cover and show the card
    $(self).css("pointer-events", "none");
}

const printResult = () => {
    const date = new Date();
    let gameFinish = date.getTime();
    let seconds = Math.ceil((gameFinish - gameStart) / 1000);
    let counter = $("#timer > div").length + 1; // add new game result 
    let newTimer = $("<div></div>").text(counter + "). " + seconds + " seconds");
    $("#timer").append(newTimer);    
}

const inGame = () => {
    $(".card").click(function () { // click on card
        if (gameStart === 0) {
            const date = new Date();
            gameStart = date.getTime();
        }
        if (countOpenCards === 0) {
            firstCity = getIdImage(this); //get id of image and save it on firstCity
            openCardAnimation(this);
            countOpenCards = countOpenCards + 1; // count of total open cards increses by 1
        }

        else if (countOpenCards === 1) {
            let secondCity = getIdImage(this); //get id of image and save it on secondCity
            openCardAnimation(this);

            if (secondCity === firstCity) {   
                $(`img[src$='${secondCity}']`).parent().fadeTo(200, 0);
                firstCity = 0;  
                countOpenCards = 0;
                countPhotos -= 1;

                if (countPhotos === 0) {  //if the game was over
                    firstCity = 0; 
                    winnerScreen();
                    
                    printResult();
                    gameStart = 0; // reset timer
                }

            } else {
                countOpenCards = 2; 
                setTimeout(function () { 
                    $(".card-cover").animate({
                        height: "show",
                      }, 400, );
                    $(".card").css("pointer-events", "unset");
                    countOpenCards = 0; //after Timeout close all cards
                    firstCity = 0;
                }, 1000);
            }
        }
    });
}

$(function () { // create listeners
    inCitySelection() // click on cities
    inGame(); // click on cards
});

const winnerScreen = () => {
    $(".game-page").hide(); // hide the field of the game
    $(".winner-page").show(2000); // and show winner-page  
};

const startOver = () => {
    $(".winner-page").hide(1000); //hide winner-page
    $(".choice-page").show(1000);  //show choice-page
}
