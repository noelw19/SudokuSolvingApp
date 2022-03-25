// const solve = './index.js'
let SBox = document.querySelectorAll('.box');
let errorBox = document.querySelector('.errorBox');
let boxCollideDiv = document.querySelector('.boxCollide');
let winText = document.querySelector('.winner');
let cover = document.querySelector('.cover');
let checkerBtn = document.querySelector('.checker');
let solverBtn = document.querySelector('.solver');


function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.addEventListener('DOMContentLoaded', function() {
    let boardToSolve = []
    let counter = 8
    

    solverBtn.addEventListener('click', () => {
        // useVal = getRandomInt(1, 9)

        // for(let i = 0; i < SBox.length; i ++) {
        //     SBox[i].value = ''
        // }
        // SBox[getRandomInt(0, 80)].value = useVal
        // boardToSolve = []


        for(let i = 0; i < SBox.length; i ++) {
            boardToSolve.push(!SBox[i].value ? null : parseInt(SBox[i].value))
            
        }
        
        boardToSolve = sliceIntoChunks(boardToSolve, 9)
        
        let newBoard = solve(boardToSolve).flat(1)
        boardToSolve = newBoard
        for(let i = 0; i < SBox.length; i ++) {
            SBox[i].value = newBoard[i]
        }
    })

    for(let i = 0; i < SBox.length; i ++) {
        SBox[i].classList.add(i);
        SBox[i].value = '';

        SBox[i].addEventListener('click', (e) => {
            console.log(e.target.classList[1])
        })

        SBox[i].addEventListener('input', function(e) {
            // console.log('started');
            boxCollideDiv.textContent = '';
            winText.textContent = '';
            winText.style.display = 'none'
            cover.style.display = 'none';
            let val = e.target.value;
            let arr = val.split('');
            // console.log('arr: ', arr, arr[arr.length -1], !parseInt(arr[arr.length-1]));
            if(!parseInt(arr[arr.length-1]) && e.target.value !== '') {
                errorBox.classList.remove('cleared')
                errorBox.classList.add('err')
                errorBox.textContent = 'error must enter number!';
                e.target.value = '';
            } else if (parseInt(arr[arr.length-1])){
                errorBox.textContent = '';
                e.target.value = arr[arr.length-1];
            } else if(e.target.value === '') {
                errorBox.classList.remove('err');
                errorBox.classList.add('cleared');
                errorBox.textContent = 'cleared';
                setTimeout(() => {
                errorBox.textContent = '';
                }, 1000)
            }
        })
    }  
})



// -------------------------------------------------------------------------
//  Solving Algorithm


function solve(board) {
    if(solved(board)) {
        return board;
    } else {
        const possibilities = nextBoards(board)
        const validBoards = keepOnlyValid(possibilities)
        return searchForSolution(validBoards)
    }
}

function searchForSolution(board) {
    if(board.length < 1) {
        return false;
    } else {
        // backtacking search for solution
        var first = board.shift()
        const tryPath = solve(first)
        if(tryPath != false) {
            return tryPath
        } else {
            return searchForSolution(board)
        }
    }
}

function solved(board) {
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            if(board[i][j] === null) {
                return false
            } 
        }
    }
    return true
}

function nextBoards(board) {
    let res = [];
    const firstEmpty = findEmptyPosition(board) // should return x and y value
    if(firstEmpty != undefined) {
        const y = firstEmpty[0]
        const x = firstEmpty[1]
        for(let i = 1; i <= 9; i++) {
            let newBoard = [...board];
            let row = [...newBoard[y]];
            row[x] = i;
            newBoard[y] = row;
            res.push(newBoard);
        }
    }
    return res
}

function findEmptyPosition(board) {
    // board -> [x, y]
    for(let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if(board[i][j] == null) {
                return [i, j]
            }
        }
    }
}

function keepOnlyValid(board) {
    return board.filter((b) => validBoard(b))
}

function validBoard(board) {
    return rowGood(board) && columnGood(board) && boxesGood(board)
}

function rowGood(board) {
    for (let i = 0; i < 9; i++) {
        let current = [];
        for (let j = 0; j < 9; j++) {
            if(current.includes(board[i][j])) {
                return false
            } else if (board[i][j] != null){
                current.push(board[i][j])
            }
        }
    }
    return true
}

function columnGood(board) {
    for (let i = 0; i < 9; i++) {
        let current = [];
        for (let j = 0; j < 9; j++) {
            if(current.includes(board[j][i])) {
                return false
            } else if (board[j][i] != null){
                current.push(board[j][i])
            }
        }
    }
    return true
}

function boxesGood(board) {
    const boxCoordinates = [
        [0, 0], [0, 1], [0, 2], 
        [1, 0], [1, 1], [1, 2],
        [2, 0], [2, 1], [2, 2]
    ]

    for (let y = 0; y < 9; y+= 3) {
        for (let x = 0; x < 9; x+=3) {
            let cur = [];
            for (let i = 0; i < 9; i++) {
                let coordinates = [...boxCoordinates[i]]
                coordinates[0] += y;
                coordinates[1] += x;
                if(cur.includes(board[coordinates[0]][coordinates[1]])) {
                    return false
                }else if( board[coordinates[0]][coordinates[1]] != null) {
                    cur.push(board[coordinates[0]][coordinates[1]])
                }
            }
        }
        
    }
    return true
}

// console.log(solve(brd1))