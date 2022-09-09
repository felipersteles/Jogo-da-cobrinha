
//Declarando as mensagens de fim de partida
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')

//Declarando o butao de reiniciar o jogo
const restartButton = document.getElementById('restartButton')

class Snake{
    constructor(x, y, size, isAlive) {
        this.x = x
        this.y = y
        this.size = size
        this.isAlive = isAlive
        this.tail = [{ x: this.x, y: this.y }]
        this.rotateX = 0
        this.rotateY = 1
    }

    //Movimento da cobrinha
    move() {
        var newRect
        if (this.rotateX == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y
            }
        }else if (this.rotateX == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y
            }
        }else if (this.rotateY == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size
            }
        }else if (this.rotateY == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size
            }
        }

        this.tail.shift()
        this.tail.push(newRect)
    }
}

class Apple{
    constructor(){
        var isTouching;
        while(true){
            isTouching = false;
            this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size
            this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size
            for (var i = 0; i < snake.tail.length; i++) {
                if (this.x == snake.tail[i].x && this.y == snake.tail[i].y) {
                    isTouching = true
                }
            }
            this.color = "pink"
            this.size = snake.size

            //console.log(this.x, this.y)
            if (!isTouching) {
                break;
            }
        }
    }
}

var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext('2d');

var snake = new Snake(20, 20, 20, true);
var apple = new Apple();

start()

restartButton.addEventListener('click', restart)

function start() {
    gameLoop(15)
}

function gameLoop(fps) {
    
    setInterval(show, 1000/fps) // 15 é o fps
}

function show() {
    update();
    draw();
}

function update() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    //console.log('update')
    if(snake.isAlive)
        snake.move()

    if (!eatApple())
        checkHitSnake()
    
    checkHitWall()
}

function restart() {
    snake = new Snake(20, 20, 20, true);
    apple = new Apple();

    winningMessageElement.classList.remove('show')
    snake.isAlive = true
}

function endGame() { //Analisar se foi empate
        
    winningMessageTextElement.innerText = 'Perdeu!'
    winningMessageElement.classList.add('show')
}

function checkHitWall() {
    var headTail = snake.tail[snake.tail.length - 1]
    if (headTail.x == -snake.size) {
        headTail.x = canvas.width - snake.size
    } else if (headTail.x == canvas.width) {
        headTail.x = 0
    } else if (headTail.y == -snake.size) {
        headTail.y = canvas.height - snake.size
    } else if (headTail.y == canvas.height) {
        headTail.y = 0
    }
}

function checkHitSnake() {
    var headTail = snake.tail[snake.tail.length - 1]
    //console.log("tamanho: " + snake.tail.length)
    for (var i = 1; i < snake.tail.length - 1; i++) {
        if (headTail.x == snake.tail[i].x && headTail.y == snake.tail[i].y) {
            //sddconsole.log("game over")
            snake.isAlive = false
            endGame()
        }
    }
}

function eatApple(){
    if (snake.tail[snake.tail.length - 1].x == apple.x && snake.tail[snake.tail.length - 1].y == apple.y) {
        snake.tail[snake.tail.length] = {x: apple.x, y: apple.y}
        apple = new Apple();

        return true
    } 

    return false
}

function draw() {
    createRect(0, 0, canvas.width, canvas.height, "black")
    createRect(0, 0, canvas.width, canvas.height)
    for (var i = 0; i < snake.tail.length; i++){
        createRect(snake.tail[i].x + 2.5,
            snake.tail[i].y + 2.5,
            snake.size - 5,
            snake.size - 5,
            'white') 
    }

    canvasContext.font = "20px Arial"
    canvasContext.fillStyle = "#00FF42"
    canvasContext.fillText("Score: " + (snake.tail.length - 1),
        canvas.width - 120, 18);

    createRect(apple.x, apple.y, apple.size, apple.size, apple.color)
}

function createRect(x, y, width, height, color) {
    canvasContext.fillStyle = color
    canvasContext.fillRect(x, y, width, height)
}

window.addEventListener("keydown", (event) => {

    //console.log(event)
    
    var upKey, downKey, leftKey, rightKey

    if (event.key == 'a' || event.key == 'ArrowLeft')
        leftKey = true
    
    if (event.key == 'w' || event.key == 'ArrowUp')
        upKey = true
    
    if (event.key == 'd' || event.key == 'ArrowRight')
        rightKey = true
    
    if (event.key == 's' || event.key == 'ArrowDown')
        downKey = true

    setTimeout(() => {
        if (leftKey && snake.rotateX != 1) {
            snake.rotateX = -1;
            snake.rotateY = 0;
        } else if (upKey && snake.rotateY != 1) {
            snake.rotateX = 0;
            snake.rotateY = -1;
        } else if (rightKey && snake.rotateX != -1) {
            snake.rotateX = 1;
            snake.rotateY = 0;
        } else if (downKey && snake.rotateY != -1) {
            snake.rotateX = 0;
            snake.rotateY = 1;
        }
    }, 1)
})


