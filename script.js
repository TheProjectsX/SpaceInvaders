const gameBoard = document.getElementById("gameBoard");
const restartGame = document.getElementById("restartGame");
const score = document.getElementById("score");
const highScore = document.getElementById("highScore");

// Arrows
const screenWidth = window.screen.width;

const ArrowUp = document.getElementById("ArrowUp");
const ArrowDown = document.getElementById("ArrowDown");
const ArrowLeft = document.getElementById("ArrowLeft");
const ArrowRight = document.getElementById("ArrowRight");

let controlerShotInterval;

// Audio Tracks
const missileShot = new Audio("audio/missile.wav");
const shipBlast = new Audio("audio/blast.wav");
const gameOver = new Audio("audio/gameOver.wav");
const gameVictory = new Audio("audio/gameVictory.wav");


// game editable variables
let shipArray, playerArray, shipPositions, shipStartX, shipStartY, shipsInX, shipsInY, playerX, playerY, missilePositions, missileNumbers, collided, moveToX, moveToY, shipVelocityX, shipVelocityY, playerPositions;


// setup game variables
function setupGame() {
    shipArray = document.getElementsByClassName("ship");
    playerArray = document.getElementsByClassName("player");

    // Ships Positions
    shipPositions = [];

    shipsInX = 3;
    shipsInY = 10;

    shipStartX = 4;
    shipStartY = Math.floor((20 - shipsInY) / 2) + 1;

    // Player position
    playerX = 17;
    playerY = 10;

    // Attact missile position
    missilePositions = []
    missileNumbers = []

    // Missile numbers which collided with ship
    collided = [];

    // To move the ships
    moveToX = shipStartX;
    moveToY = shipStartY;

    shipVelocityX = 0;
    shipVelocityY = -1;

    // To move player
    /* Player Angle
      *
     ***
    */
    playerPositions = [
        [playerX, playerY],
        [playerX + 1, playerY - 1],
        [playerX + 1, playerY],
        [playerX + 1, playerY + 1]
    ];
}



// Game Interval
let gameInterval;

// Game Speed
let gameSpeed = 200; // miliseconds

// Score
let currentScore = 0;
let currentHighScore = 0;

// Game Level
let gameLevel = 0;

// Check and Set game High Score
function setHighScore(check) {
    if (!(check)) {
        currentHighScore = localStorage.getItem("highScore") ?? 0;
    } else {
        if (currentScore > currentHighScore) {
            currentHighScore = currentScore;
            localStorage.setItem("highScore", currentHighScore);
        }
    }

    highScore.innerText = currentHighScore.toString().length < 2 ? "0" + currentHighScore : currentHighScore;
}


// Create Ships
function createShips(shipsInX, shipsInY) {
    let amount = shipsInX * shipsInY;
    for (let i = 0; i < amount; i++) {
        let ship = document.createElement("div");
        ship.classList.add("ship");
        ship.classList.add(`ship-${i + 1}`);
        gameBoard.appendChild(ship);
    }
}


// Setting the ships
function setShipPosition(shipStartX, shipStartY) {
    shipPositions = [];
    for (let i = 0; i < shipsInX; i++) {
        let positionX = shipStartX + i;
        for (let j = 0; j < shipsInY; j++) {
            let positionY = shipStartY + j;
            // console.log(`ship-${(i*10) + j + 1}`)
            let theShip = document.querySelector(`.ship-${(i * shipsInY) + j + 1}`);
            theShip.style.gridArea = `${positionX} / ${positionY} / auto / auto`
            gameBoard.appendChild(theShip);

            shipPositions.push([positionX, positionY]);
        }
    }
}

// Setting player position
function setPlayerPosition(playerVelocityX, playerVelocityY) {
    for (let i = 0; i < playerPositions.length; i++) {
        let player = playerArray[i];
        let positionX = playerPositions[i][0] + playerVelocityX;
        let positionY = playerPositions[i][1] + playerVelocityY;

        player.style.gridArea = `${positionX} / ${positionY} / auto / auto`

        playerPositions[i] = [positionX, positionY];
    }

}

// Shoot Missile
function shotMissile() {
    if (gameInterval != null) {
        missileShot.play();
    }

    let number = 1;

    let missile = document.createElement("div");
    missile.classList.add("missile");
    missile.classList.add("none");
    if (missileNumbers.length > 0) {
        number = missileNumbers[missileNumbers.length - 1] + 1;
    }

    missile.classList.add(`missile-` + number)
    missileNumbers.push(number);
    gameBoard.appendChild(missile);

    missilePositions.push([playerX, playerY]);
}


// Event Listeners

// Play with Keyboard
window.addEventListener("keydown", (e) => {
    let playerVelocityX = 0;
    let playerVelocityY = 0;

    if (e.code == "ArrowUp") {
        if (playerX == 1) {
            return;
        }

        playerX += -1;
        playerVelocityX = -1;
    } else if (e.code == "ArrowDown") {
        if (playerX + 1 == 20) {
            return;
        }

        playerX += 1;
        playerVelocityX = 1;
    } else if (e.code == "ArrowLeft") {
        if (playerY - 2 < 1) {
            return;
        }

        playerY += -1;
        playerVelocityY = -1;
    } else if (e.code == "ArrowRight") {
        if (playerY + 2 > 20) {
            return;
        }

        playerY += 1;
        playerVelocityY = 1;
    } else if (e.code == "Space") {
        if (gameInterval != null && gameInterval != "pause") {
            shotMissile();
        } else{
            restartGame.click();
        }
    } else if (e.code == "KeyA") {
        clearInterval(controlerShotInterval);
        clearInterval(gameInterval);
        gameInterval = "pause";
    } else if (e.code == "KeyB") {
        if (gameInterval == "pause") {
            gameInterval = setInterval(initGame, gameSpeed);
        }
    }

    setPlayerPosition(playerVelocityX, playerVelocityY);
    // console.log(e)
})

// Play via control
ArrowUp.addEventListener("click", () => {
    let playerVelocityX = 0;
    let playerVelocityY = 0;

    if (playerX == 1) {
        return;
    }

    playerX += -1;
    playerVelocityX = -1;

    setPlayerPosition(playerVelocityX, playerVelocityY);
});

ArrowDown.addEventListener("click", () => {
    let playerVelocityX = 0;
    let playerVelocityY = 0;

    if (playerX + 1 == 20) {
        return;
    }

    playerX += 1;
    playerVelocityX = 1;

    setPlayerPosition(playerVelocityX, playerVelocityY);
});

ArrowLeft.addEventListener("click", () => {
    let playerVelocityX = 0;
    let playerVelocityY = 0;

    if (playerY - 2 < 1) {
        return;
    }

    playerY += -1;
    playerVelocityY = -1;

    setPlayerPosition(playerVelocityX, playerVelocityY);
});

ArrowRight.addEventListener("click", () => {
    let playerVelocityX = 0;
    let playerVelocityY = 0;

    if (playerY + 2 > 20) {
        return;
    }

    playerY += 1;
    playerVelocityY = 1;

    setPlayerPosition(playerVelocityX, playerVelocityY);
});


// Restart Game
restartGame.addEventListener("click", () => {
    if (restartGame.innerText != "Start Game") {
        setupGame();
        resetGame();
    }
    console.log(screenWidth)
    if (screenWidth < 501) {
        controlerShotInterval = setInterval(shotMissile, gameSpeed - 10);
    }

    restartGame.innerText = "Restart Game"
    restartGame.style.display = "none";

    gameInterval = setInterval(initGame, gameSpeed);
})


// Check if missile Blasts any ship
function checkShipBlast(position, missilePosition) {
    let missile = document.querySelector(`.missile-${position}`);
    if (shipPositions.some(arr => JSON.stringify(arr) === JSON.stringify(missilePosition))) {
        let gridArea = `${missilePosition[0]} / ${missilePosition[1]} / auto / auto`
        let ship = document.querySelector(`.ship[style*="${gridArea}"]`)

        if (ship.classList.contains("none")) {
            return
        }

        // console.log(ship.classList.value)
        shipBlast.play();


        missile.style.display = "none";
        ship.style.display = "none";
        ship.classList.add("none");
        shipPositions.splice(shipPositions.findIndex(subArr => JSON.stringify(subArr) === JSON.stringify(missilePosition)), 1);

        currentScore += 5;
        score.innerText = currentScore.toString().length < 2 ? "0" + currentScore : currentScore;
        setHighScore(true);

        return position;

    } else if (missilePosition[0] === 0) {
        missile.style.display = "none";
        return position
    }

    return false;

}

// Reset Game
function resetGame() {
    gameBoard.innerHTML = `<div class="player head"></div>
    <div class="player body"></div>
    <div class="player body"></div>
    <div class="player body"></div>`;

    playerX = 17;
    playerY = 10;

    if (shipsInY < 12) {
        shipsInY += gameLevel * 2;
    } else {
        shipsInX += 1;
    }
    if (gameLevel > 2) {
        shipStartX = 3;
    }
    if (gameLevel > 1) {
        gameSpeed += (gameLevel - 1) * 12;
    }

    createShips(shipsInX, shipsInY);
    setShipPosition(shipStartX, shipStartY);
    setPlayerPosition(0, 0);

}

// check gameover and points
function GameOver() {
    let shipCollided = document.querySelectorAll(".ship.none");
    if (shipCollided.length == (shipsInX * shipsInY)) {
        clearInterval(controlerShotInterval);
        clearInterval(gameInterval);
        gameLevel += 1;

        setTimeout(() => {
            gameVictory.play();

            setTimeout(() => {
                alert("YAY!\nYou Saved the Galaxy!");
                restartGame.style.display = "inline";
            }, 1000);

        }, 400);
        return true;
    }


    let shipNmissileCollided = false;

    for (let i = 0; i < shipPositions.length; i++) {
        let gridArea = `${shipPositions[i][0]} / ${shipPositions[i][1]} / auto / auto`;
        let ship = document.querySelector(`.ship[style*="${gridArea}"]`);
        if ((!(ship.classList.contains("none"))) && (shipPositions[i][0] == 20)) {
            shipNmissileCollided = true;
        }

    }

    if (shipNmissileCollided) {
        clearInterval(controlerShotInterval);
        clearInterval(gameInterval);
        gameOver.play();

        setTimeout(() => {
            alert("OOPS!\nYou couldn't save your Galaxy!");
            restartGame.style.display = "inline";
        }, 1000);

        return true;
    }

    return false;
}

// Iniialize Game
function initGame() {
    if (GameOver()) {
        gameInterval = null;
        return;
    }

    for (let i = 0; i < missileNumbers.length; i++) {
        if (collided.includes(missileNumbers[i])) {
            continue
        }

        missilePositions[i][0] = missilePositions[i][0] - 1;
        let attack = missilePositions[i];
        let missile = document.querySelector(`.missile-${missileNumbers[i]}`);
        missile.style.gridArea = `${attack[0]} / ${attack[1]} / auto / auto`
        missile.style.display = "block";

        // console.log(missile);
        collid = checkShipBlast(missileNumbers[i], missilePositions[i]);
        if (collid !== false) {
            collided.push(collid)
        }
        // console.log(missile);
    }

    if (moveToY == 1) {
        shipVelocityY = 1;
        shipVelocityX = 1;
    } else if (moveToY == (21 - shipsInY)) {
        shipVelocityY = -1
        shipVelocityX = 1;
    }

    if (moveToY == 10) {
        shipVelocityX = 1;

    }

    moveToX += shipVelocityX;
    moveToY += shipVelocityY;

    shipVelocityX = 0;

    // moveTheShips(velocityX, velocityY);
    setShipPosition(moveToX, moveToY);

}


// Setup Game
setupGame();
setHighScore();
createShips(shipsInX, shipsInY);
setShipPosition(shipStartX, shipStartY);
setPlayerPosition(0, 0);

