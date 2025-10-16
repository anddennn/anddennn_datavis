const section = document.querySelector("section");
const starBox = document.querySelector(".star-box");
const star = document.querySelector(".star");
const FPS = 60;

// Styling suggestion because CSS wasn't working...
starBox.style.position = "relative";
star.style.position = "absolute";
star.style.width = "100px";
star.style.height = "100px";

let xPosition = 10;
let yPosition = 10;
let xSpeed = 4;
let ySpeed = 4;


// Dimension function so I don't forget
function getDims() {
    return {
        boxWidth: starBox.clientWidth,
        boxHeight: starBox.clientHeight,
        starWidth: star.clientWidth || 100,
        starHeight: star.clientHeight || 100
    };
}

function update() {
    star.style.transform = `translate(${xPosition}px, ${yPosition}px)`;
}

// Make it bounce hehe
setInterval(() => {
    const { boxWidth, boxHeight, starWidth, starHeight } = getDims();

    if (xPosition + starWidth >= boxWidth || xPosition <= 0) {
        xSpeed = -xSpeed;
    }
    if (yPosition + starHeight >= boxHeight || yPosition <= 0) {
        ySpeed = -ySpeed;
    }

    xPosition += xSpeed;
    yPosition += ySpeed;
    update();
}, 1000 / FPS);

// Change color on click
starBox.addEventListener("click", changeStarColor);

function changeStarColor() {
    const polygon = star.querySelector("polygon");
    if (polygon) {
        polygon.setAttribute("fill", randomColor());
    }
}

function randomColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, "0");
}

window.addEventListener("resize", () => {
    xPosition = 10;
    yPosition = 10;

    section.style.height = window.innerHeight + "px";
    section.style.width = window.innerWidth + "px";
});

