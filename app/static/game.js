const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player
const player = {
    x: 370,
    y: 550,
    width: 60,
    height: 20,
    speed: 7
};

const keys = {};

let bullets = [];
let balls = [];

let score = 0;
let lives = 3;
let level = 1;
let gameOver = false;

// Spawn Ball
function spawnBall() {
    balls.push({
        x: Math.random() * (canvas.width - 40) + 20,
        y: -20,
        radius: 20,
        speed: 2 + level
    });
}

spawnBall();

// Keyboard
document.addEventListener("keydown", (e) => {

    keys[e.key] = true;

    if (e.code === "Space" && !gameOver) {

        bullets.push({
            x: player.x + player.width / 2,
            y: player.y
        });

    }

});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// Restart
function restartGame(){

    score = 0;
    level = 1;
    lives = 3;

    bullets = [];
    balls = [];

    spawnBall();

    gameOver = false;

}

// Update
function update(){

    if(gameOver)
        return;

    if(keys["ArrowLeft"] && player.x>0)
        player.x-=player.speed;

    if(keys["ArrowRight"] &&
        player.x<canvas.width-player.width)
        player.x+=player.speed;

    bullets.forEach(b=>{
        b.y-=10;
    });

    bullets=bullets.filter(b=>b.y>0);

    balls.forEach(ball=>{
        ball.y+=ball.speed;

        if(ball.y>canvas.height){

            lives--;

            ball.y=-20;
            ball.x=Math.random()*760+20;

            if(lives<=0){

                gameOver=true;

            }

        }

    });

    balls.forEach((ball,bi)=>{

        bullets.forEach((bullet,bui)=>{

            let dx=bullet.x-ball.x;
            let dy=bullet.y-ball.y;

            if(Math.sqrt(dx*dx+dy*dy)<ball.radius){

                balls.splice(bi,1);
                bullets.splice(bui,1);

                score++;

                if(score%5===0){

                    level++;

                }

                spawnBall();

            }

        });

    });

}

// Draw

function drawPlayer(){

    ctx.fillStyle="cyan";

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );

}

function drawBullets(){

    ctx.fillStyle="yellow";

    bullets.forEach(b=>{

        ctx.fillRect(
            b.x,
            b.y,
            6,
            15
        );

    });

}

function drawBalls(){

    ctx.fillStyle="red";

    balls.forEach(ball=>{

        ctx.beginPath();

        ctx.arc(
            ball.x,
            ball.y,
            ball.radius,
            0,
            Math.PI*2
        );

        ctx.fill();

    });

}

function drawHUD(){

    ctx.fillStyle="white";

    ctx.font="24px Arial";

    ctx.fillText("Score : "+score,10,30);

    ctx.fillText("Lives : "+lives,10,60);

    ctx.fillText("Level : "+level,10,90);

}

function drawGameOver(){

    ctx.fillStyle="white";

    ctx.font="50px Arial";

    ctx.fillText("GAME OVER",220,250);

    ctx.font="25px Arial";

    ctx.fillText("Press R to Restart",250,320);

}

// Restart Key

document.addEventListener("keydown",(e)=>{

    if(e.key==="r" || e.key==="R"){

        if(gameOver){

            restartGame();

        }

    }

});

// Game Loop

function gameLoop(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    update();

    drawPlayer();

    drawBullets();

    drawBalls();

    drawHUD();

    if(gameOver){

        drawGameOver();

    }

    requestAnimationFrame(gameLoop);

}

gameLoop();
