const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const shipWidth = 100;
const shipHeight = 100;
let shipX = (canvas.width - shipWidth) / 2;
let shipY = canvas.height - shipHeight - 10;
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
let bullets = [];
let enemies = [];
let bonuses = [];
let lives = 3;
let score = 0;
const maxBullets = 5;
const enemySpawnRate = 0.02;  // Tasa constante de aparición de enemigos
const bonusSpawnRate = 0.002;  // Tasa constante de aparición de bonos

const shipImage = new Image();
const bulletImage = new Image();
const enemyImage1 = new Image();
const enemyImage2 = new Image();
const bonusImage = new Image();

shipImage.src = "spaceship.png";
bulletImage.src = "proyectiles.png";
enemyImage1.src = "kuromi-male.png";
enemyImage2.src = "kuromi-male2.png";
bonusImage.src = "kuromi-good.png";

const bulletWidth = 30;
const bulletHeight = 30;
const enemyWidth = 80;
const enemyHeight = 80;
const bonusWidth = 80;
const bonusHeight = 80;

const loseMessages = [
    "que manca eres mi amor",
    "así de mala me gustas",
    "apúntele bien mi amor",
    "Te quiero mucho Mia",
    "ayy Mia miita de mi <3",
    "Mejor anda a cosinar (con amor)",
    "waosss te quiero"
];

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    } else if (e.key === " " || e.key === "Spacebar") {
        if (!spacePressed && bullets.length < maxBullets) {  // Limitar la cantidad de balas en pantalla
            bullets.push({ x: shipX + shipWidth / 2 - bulletWidth / 2, y: shipY });
            spacePressed = true;
        }
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    } else if (e.key === " " || e.key === "Spacebar") {
        spacePressed = false;
    }
}

function drawShip() {
    ctx.drawImage(shipImage, shipX, shipY, shipWidth, shipHeight);
}

function drawBullets() {
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        ctx.drawImage(bulletImage, bullet.x, bullet.y, bulletWidth, bulletHeight);
        bullet.y -= 5;
        if (bullet.y < 0) {
            bullets.splice(i, 1);
            i--; // Ajustar índice tras eliminación
        }
    }
}

function drawEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        let img = enemy.type === 1 ? enemyImage1 : enemyImage2;
        ctx.drawImage(img, enemy.x, enemy.y, enemyWidth, enemyHeight);
        enemy.y += 2;
        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);
            i--; // Ajustar índice tras eliminación
            lives--;
            if (lives === 0) {
                alert(loseMessages[Math.floor(Math.random() * loseMessages.length)]);
                document.location.reload();
            }
        }
    }
}

function drawBonuses() {
    for (let i = 0; i < bonuses.length; i++) {
        let bonus = bonuses[i];
        ctx.drawImage(bonusImage, bonus.x, bonus.y, bonusWidth, bonusHeight);
        bonus.y += 2;
        if (bonus.y > canvas.height) {
            bonuses.splice(i, 1);
            i--; // Ajustar índice tras eliminación
        }
    }
}

function spawnEnemies() {
    if (Math.random() < enemySpawnRate) {
        let enemyX = Math.random() * (canvas.width - enemyWidth);
        let type = Math.random() < 0.5 ? 1 : 2;
        enemies.push({ x: enemyX, y: 0, type });
    }
}

function spawnBonuses() {
    if (Math.random() < bonusSpawnRate) {
        let bonusX = Math.random() * (canvas.width - bonusWidth);
        bonuses.push({ x: bonusX, y: 0 });
    }
}

function collisionDetection() {
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];

        for (let j = 0; j < enemies.length; j++) {
            let enemy = enemies[j];
            if (
                bullet.x > enemy.x &&
                bullet.x < enemy.x + enemyWidth &&
                bullet.y > enemy.y &&
                bullet.y < enemy.y + enemyHeight
            ) {
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                score += 10;
                i--; // Ajustar índice tras eliminación
                break;
            }
        }

        for (let k = 0; k < bonuses.length; k++) {
            let bonus = bonuses[k];
            if (
                bullet.x > bonus.x &&
                bullet.x < bonus.x + bonusWidth &&
                bullet.y > bonus.y &&
                bullet.y < bonus.y + bonusHeight
            ) {
                bullets.splice(i, 1);
                bonuses.splice(k, 1);
                i--; // Ajustar índice tras eliminación
                break;
            }
        }
    }

    for (let i = 0; i < bonuses.length; i++) {
        let bonus = bonuses[i];
        if (
            bonus.x > shipX &&
            bonus.x < shipX + shipWidth &&
            bonus.y > shipY &&
            bonus.y < shipY + shipHeight
        ) {
            bonuses.splice(i, 1);
            if (lives < 3) {
                lives++;
            }
        }
    }
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FF69B4";
    ctx.fillText("Vidas: " + lives, 8, 20);
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FF69B4";
    ctx.fillText("Puntaje: " + score, canvas.width - 100, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShip();
    drawBullets();
    drawEnemies();
    drawBonuses();
    collisionDetection();
    spawnEnemies();
    spawnBonuses();
    drawLives();
    drawScore();

    if (rightPressed && shipX < canvas.width - shipWidth) {
        shipX += 5;
    } else if (leftPressed && shipX > 0) {
        shipX -= 5;
    }

    requestAnimationFrame(draw);
}

draw();
