// Game parameters
var gameConfig = {
    width: 589, //Width of the whole picture
    height: 416, //Height of the whole picture
    row: 3, //Rows of small squares
    cols: 3, //Number of columns of small squares
    imageurl: "https://www.planetware.com/wpimages/2020/02/france-in-pictures-beautiful-places-to-photograph-eiffel-tower.jpg", //Path to picture
    dom: document.getElementsByClassName("picture-puzzle")[0], //Game container dom
    isOver: false, //Is the game over
    minStep: 30,//The minimum number of steps to break the puzzle
    maxStep: 100//The maximum number of steps to break the puzzle
    // isHaveSolution: false //Is there a solution to the game
}

gameConfig.pieceWidth = gameConfig.width / gameConfig.row; //Width of each patch
gameConfig.pieceHeight = gameConfig.height / gameConfig.cols; //Height of each piece

var blocks = []; //Store each small piece of information

//Cube constructor
function Block(row, cols) {
    // this.sequenceNumber; //The number of blocks is from 1 to (row*cols)-1; the number of blank cells is 0
    this.width = gameConfig.pieceWidth; //wide
    this.height = gameConfig.pieceHeight; //high
    this.correctRow = row; //The correct number of rows where the small block is located is used to determine whether the number of rows in the block is correct
    this.correctCols = cols; //The correct number of columns in which the small square is located is used to determine whether the number of columns in the square is correct
    this.row = row; //Current row number of small squares
    this.cols = cols; //Current number of columns of small squares
    this.isDisplay = false; //Blank block or not: true.yes;false:no;

    this.div = document.createElement("div");
    this.div.className = 'pice'
    this.div.style.width = '33%'
    this.div.style.height = '33%'
    // this.div.style.width = gameConfig.pieceWidth + "px";
    // this.div.style.height = gameConfig.pieceHeight + "px";
    this.div.style.background = `url("${gameConfig.imageurl}") -${this.correctCols * this.width}px -${this.correctRow * this.height}px`;
    this.div.style.border = "1px solid #fff";
    this.div.style['box-sizing'] = "border-box";
    this.div.style.position = "absolute";
    
    this.show = function () { //Show the location of the small box
        this.div.style.left = this.cols * 33 + "%";
        this.div.style.top = this.row * 33 + "%";
        // this.div.style.left = this.cols * gameConfig.pieceWidth + "px";
        // this.div.style.top = this.row * gameConfig.pieceHeight + "px";
        
    }
    this.show();
    
    if (row === gameConfig.row - 1 && cols === gameConfig.cols - 1) { //Last box hidden
        this.div.style.display = "none";
        this.isDisplay = true; //Blank block or not: true.yes;false:no;
    }
    gameConfig.dom.appendChild(this.div);
    // this.img = document.createElement("img");
    // this.img.src = `url("${gameConfig.imageurl}")`
    // this.img.style.width = '100%'
    // var pice = document.getElementsByClassName("pice")[0], //Game container dom


    this.isCorrect = function () { //Determine whether the row and column of the current position of the block is equal to the row and column of the correct position
        if (this.row === this.correctRow && this.cols === this.correctCols) {
            return true;
        }
        return false;
    }
}

//Initialize game
function init() {
    //1.Initialize game container width
    initGameDom();
    //2.Initialize basic information of each small block
    initBlocksArray();
    //3.The algorithm that can be solved by the disordered puzzle is not understood, only the program can automatically walk 100 steps
    // while (!gameConfig.isHaveSolution) {
    randomSort();
    // }
    //4.Register click events
    registerEvent();

    //Initialize game container
    function initGameDom() {
        gameConfig.dom.style.width = gameConfig.width + "px";
        gameConfig.dom.style.height = gameConfig.height + "px";
        gameConfig.dom.style.border = "2px solid #ccc";
        gameConfig.dom.style.position = "relative";
    }

    //Initialize small block array information
    function initBlocksArray() {
        for (var i = 0; i < gameConfig.row; i++) {
            for (var j = 0; j < gameConfig.cols; j++) {
                // Basic information of each block
                var block = new Block(i, j);
                blocks.push(block);
            }
        }
        // blocks.forEach(function (item, index) {
        //     item.sequenceNumber = index + 1;
        // });
        // blocks[gameConfig.row * gameConfig.cols - 1].sequenceNumber = 0; //The last blank block number is 0
    }

    //Disorder the order of small squares
    function randomSort() {
        var step = getRandom(gameConfig.minStep, gameConfig.maxStep);//Random in[30,100)Take a number from the interval as the number of steps to scramble the puzzle
        console.log(step);
        //Procedure self walking step Step, disorganize the sequence of puzzles
        for (var i = 0; i < step; i++) {
            // Find the row and column where the blank block is located
            var blankBlock = blocks.filter(function (item) {
                return item.isDisplay;
            });

            for (var j = 0; j < blocks.length; j++) {
                //Judge whether it can be exchanged. If the abscissa is the same, the ordinate is 1||If the ordinates are the same, the abscissa difference is 1
                if (blocks[j].row === blankBlock[0].row && Math.abs(blocks[j].cols - blankBlock[0].cols) === 1 ||
                    blocks[j].cols === blankBlock[0].cols && Math.abs(blocks[j].row - blankBlock[0].row) === 1) {
                    exchangeBlocks(blocks[j], blankBlock[0]);
                    continue; //Enter the next cycle after one exchange, and ensure the number of exchanges is step second
                }
            }
        }
        // for (var i = 0; i < (gameConfig.row * gameConfig.cols - 1); i++) {
        //     //1. Generate a random number
        //     //2. Exchange the current small block information with randomly selected small block information, and the position of the last blank block remains unchanged
        //     var index = getRandom(0, blocks.length - 2);
        //     //Exchange data
        //     exchangeBlocks(blocks[i], blocks[index]);
        // }

        blocks.forEach(function (item) {
            item.show();
        });
        //Judge whether the puzzle has solutions
        // haveSolution();
    }

    //Judge whether there is solution to the disordered puzzle
    // function haveSolution() {
    //     var count = 0;
    //     //Count the number of reverse sequences: the number in front is greater than the number in the back
    //     for (var i = 0; i < blocks.length; i++) {
    //         for (var j = i + 1; j < (blocks.length - 1 - i); j++) {
    //             console.log(i, j, blocks[i].sequenceNumber);
    //             if (blocks[i].sequenceNumber > blocks[j].sequenceNumber) {
    //                 count++;
    //             }
    //         }
    //     }
    //     console.log(count);

    //     //Calculate the position where the blank block number is 0
    //     var blankBlock = gameConfig.row * gameConfig.cols - 1;

    //     //No solution for different parity
    //     gameConfig.isHaveSolution = (count % 2 != blankBlock % 2) ? false : true;
    //     console.log(gameConfig.isHaveSolution);
    // }

    //Register events for blocks
    function registerEvent() {
        //Blank block found
        var isDisplayBlock = blocks.find(function (item) {
            return item.isDisplay;
        });
        blocks.forEach(function (item) {
            item.div.onclick = function () {
                if (gameConfig.isOver) { //At the end of the game, the following operations will not be continued
                    return;
                }
                //Judge whether it can be exchanged. If the abscissa is the same, the ordinate is 1||If the ordinates are the same, the abscissa difference is 1
                if (item.row === isDisplayBlock.row && Math.abs(item.cols - isDisplayBlock.cols) === 1 ||
                    item.cols === isDisplayBlock.cols && Math.abs(item.row - isDisplayBlock.row) === 1) {
                    exchangeBlocks(item, isDisplayBlock);
                }
                //game over
                isWin();
            }
        });
    }

    //Swap the positions of two squares
    function exchangeBlocks(b1, b2) {
        var temp = b1.row;
        b1.row = b2.row;
        b2.row = temp;

        var temp = b1.cols;
        b1.cols = b2.cols;
        b2.cols = temp;

        // var temp = b1.sequenceNumber;
        // b1.sequenceNumber = b2.sequenceNumber;
        // b2.sequenceNumber = temp;

        b1.show();
        b2.show();
    }

    //game over
    function isWin() {
        var wrongBlocks = blocks.filter(function (item) { //Filter out the wrong box
            return !item.isCorrect();
        });
        if (wrongBlocks.length === 0) { //All the squares are in the right place
            console.log('win');
            gameConfig.isOver = true; //game over
            blocks.forEach(function (item) {
                item.div.style.display = "block";
                item.div.style.border = "none";
            });
        }
    }
    //-------------General function----begin-----------//

    //Return to a[min,max)Random number of interval
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //-------------General function----end-----------//
}

init();