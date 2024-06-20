//Var declerations
const grid = document.querySelector('.grid')
const width = 100, height = 20, boardWidth = 560, boardHeight = 300, ballDiameter = 20
const userStart = [230,10], ballStart = [270,40]
let userPos = userStart, ballPos = ballStart, xDir = (random(0,1) === 0) ? 2 : -2, yDir = (random(0,1) === 0) ? 2 : -2
console.log(xDir,yDir)
let timerID = null
let startFlag = true

//block initialization
class Block{
constructor(x,y){
    this.L = x
    this.R = x+width
    this.B = y
    this.T = y+height
    }
}    
const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210)
]

function addBlocks(){
    for(let i=0 ; i < blocks.length ; i++){
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = blocks[i].L + 'px'
        block.style.bottom = blocks[i].B + 'px'
        grid.appendChild(block)

    }
}
addBlocks()

//player initialization and functionality
const player =document.createElement('div')
player.classList.add('player')
guiPlayer()
grid.appendChild(player)

function guiPlayer(){
    player.style.left = userPos[0] + 'px'
    player.style.bottom = userPos[1] + 'px'
}

function moveUser(e){
    switch(e.key){
        case 'ArrowLeft': 
            if(userPos[0]>0){
                userPos[0] -= 10
            }
            guiPlayer()
            break;
        case 'ArrowRight': 
            if(userPos[0]<boardWidth - width){
                userPos[0] += 10
            }
            guiPlayer()
            break;
        case ' ':
            if(startFlag){
                start()
            }
            startFlag = false
            break;
    }
}

document.addEventListener('keydown',moveUser)

//ball initialization and functionality
const ball = document.createElement('div')
ball.classList.add('ball')
guiBall()
grid.appendChild(ball)

function guiBall(){
    ball.style.left = ballPos[0] + 'px'
    ball.style.bottom = ballPos[1] + 'px'
}

function moveBall(){
    ballPos[0] += xDir
    ballPos[1] += yDir
    guiBall()
    checkForCollision()
}

function checkForCollision(){
    //player
    let pBlock = new Block(userPos[0],userPos[1])
    if(ballPos[1] == pBlock.T && (ballPos[0] >= pBlock.L - ballDiameter/2 && ballPos[0] <= pBlock.R + ballDiameter/3)){
        yDir = 2
        console.log('hit player top!')
    }
    else if(ballPos[0] + ballDiameter >= pBlock.L && ballPos[0] + ballDiameter <= pBlock.L + 10 && (ballPos[1] >= pBlock.B && ballPos[1] <= pBlock.T)){
        yDir = 2
        xDir *= -1
        console.log('hit player left!')
    } 
    else if(ballPos[0] <= pBlock.R && ballPos[0] >= pBlock.R - 10 && (ballPos[1] >= pBlock.B && ballPos[1] <= pBlock.T)){
        yDir = 2
        xDir *= -1
        console.log('hit player right!')
    }
    //block
    for(let i = 0 ; i < blocks.length ; i++){
        // bottom hit
        if( ballPos[0] + ballDiameter/2 >= blocks[i].L &&
            ballPos[0] + ballDiameter/3 <= blocks[i].R &&
            ballPos[1] + ballDiameter == blocks[i].B){
                console.log('hit bottom!' + i)
                guiBlocks = Array.from(document.querySelectorAll('.block'))
                guiBlocks[i].remove('block')
                blocks.splice(i,1)
                yDir *= -1
        }
        // top hit
        else if( ballPos[0] + ballDiameter/2 >= blocks[i].L &&
            ballPos[0] + ballDiameter/3 <= blocks[i].R &&
            ballPos[1] == blocks[i].T){
                console.log('hit top!' + i)
                guiBlocks = Array.from(document.querySelectorAll('.block'))
                guiBlocks[i].remove('block')
                blocks.splice(i,1)
                yDir *= -1
        }
        // left hit
        else if( ballPos[1] + ballDiameter >= blocks[i].B &&
            ballPos[1] <= blocks[i].T &&
            ballPos[0] + ballDiameter == blocks[i].L){
                console.log('hit left!' + i)
                guiBlocks = Array.from(document.querySelectorAll('.block'))
                guiBlocks[i].remove('block')
                blocks.splice(i,1)
                xDir *= -1
        }
        // right hit
        else if( ballPos[1] + ballDiameter >= blocks[i].B &&
            ballPos[1] <= blocks[i].T &&
            ballPos[0] == blocks[i].R){
                console.log('hit right!' + i)
                guiBlocks = Array.from(document.querySelectorAll('.block'))
                guiBlocks[i].remove('block')
                blocks.splice(i,1)
                xDir *= -1
        }
    }

    //walls
     if(ballPos[1] >= (boardHeight - ballDiameter) || ballPos[0] >= (boardWidth - ballDiameter) || ballPos[0] <= 0){
        changeDir()
     }
     if(ballPos[1] <= 0){
        loseGame()
     }

}

function changeDir(){
    if(ballPos[0] >= (boardWidth - ballDiameter)){
        console.log('hit side wall!')
        xDir = -2
    }
    if(ballPos[1] >= (boardHeight - ballDiameter)){
        console.log('hit top/bottom wall!')
        yDir = -2
    }
    if(ballPos[0] <= 0){
        console.log('hit side wall!')
        xDir = 2
    }
}

function start(){
    timerID = setInterval(moveBall, 15) 
}

function loseGame(){
    xDir = 0
    yDir = 0
    document.removeEventListener('keydown',moveUser)
    clearInterval(timerID)
}

function random(min,max) {
    return Math.floor((Math.random())*(max-min+1))+min;
   }