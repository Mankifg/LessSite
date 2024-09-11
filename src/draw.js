const BACKGROUND_COLOR = "#ffff";
const ONE_COST_STEP_COLOR = "#ADD8E6";
const DOUBLE_COST_STEP_COLOR = "#1a4cd6";

const BINARY_LEN = 12;
const FULL = 150;
const THICK = 9;
const HALF = FULL/2;
const RADIUS = 20
const INT_MAX = Math.pow(2, BINARY_LEN);
var SCALE = 0.8

function binaryBy12(dec) {
    let b = dec.toString(2);
    return b.padStart(12, '0');
}

function getColor(c) {
    console.log("fff",c);
    switch (c) {
        case 'w':
            return "#cccdff"; // Red
        case 'b':
            return "#000000"; // Blue
        default:
            console.error("Unknown color");
            return "#f500d0"; // pink
    }
}

function drawEmptyTile(ctx,oriX,oriY) {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(oriX+0, oriY+0, oriX + THICK, oriY + THICK);

    ctx.strokeStyle = ONE_COST_STEP_COLOR;
    ctx.lineWidth = 10;

    // Draw border lines
    /*ctx.beginPath();
    ctx.moveTo(oriX + 0, oriY + 0);
    ctx.lineTo(oriX + 0, oriY + FULL);
    ctx.moveTo(oriX + 0, oriY + 0);
    ctx.lineTo(oriX + FULL, oriY + 0);
    ctx.moveTo(oriX + FULL, oriY + 0);
    ctx.lineTo(oriX + FULL, oriY + FULL);
    ctx.moveTo(oriX + 0, oriY + FULL);
    ctx.lineTo(oriX + THICK, oriY + FULL);
    ctx.lineTo(oriX + FULL, oriY + FULL);
    ctx.stroke();*/

    ctx.beginPath();
    ctx.moveTo(oriX + 0, oriY + 0);
    ctx.lineTo(oriX + 0, oriY + FULL);
    ctx.lineTo(oriX + FULL, oriY + FULL);
    ctx.lineTo(oriX + FULL, oriY + 0);
    ctx.lineTo(oriX + 0, oriY + 0);


    
    ctx.stroke();

    // Draw cross lines
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(oriX + 0, oriY + HALF);
    ctx.lineTo(oriX + FULL, oriY + HALF);
    ctx.moveTo(oriX + HALF, oriY + 0);
    ctx.lineTo(oriX + HALF, oriY + FULL);
    ctx.moveTo(oriX + 0, oriY + 0);

    ctx.stroke();
}

function offset(wide, total = 100) {
    return (total - wide) / 2;
}
function o2() {
    return THICK / 2
}

function drawWalls(ctx, dec,oriX,oriY) {
    if (dec > INT_MAX) {
        return;
    }

    const binary = binaryBy12(dec);
    if (binary.length !== 12) {
        return;
    }

    console.log(binary)

    const ROM = [
        [0+o2(), 0, HALF-THICK, THICK],
        [HALF+o2(), 0, HALF-THICK, THICK],

        [0, 0+o2(), THICK, HALF-THICK],
        [HALF-o2(), 0+o2(), THICK, HALF-THICK],
        [FULL - THICK, o2(), THICK, HALF-THICK],

        [0+o2(), HALF-o2(), HALF-THICK, THICK],
        [HALF+o2(), HALF-o2(), HALF-THICK, THICK],

        [0, HALF+o2(), THICK, HALF-THICK,],
        [HALF-o2(), HALF+o2(), THICK, HALF-THICK],
        [FULL-THICK, HALF+o2(), THICK, HALF-THICK],


        [0+o2(), FULL - THICK, HALF-THICK, THICK],
        [HALF+o2(), FULL - THICK, HALF-THICK, THICK]
    ];

    for (let i = 0; i < ROM.length; i++) {
        if (binary[i] === "1") {
            let [x, y, w, h] = ROM[i];
            ctx.fillStyle = DOUBLE_COST_STEP_COLOR;
            ctx.fillRect(oriX + x, oriY + y,w, h);
        }
    }
}

function circle(ctx,color,px,py) {
    console.log("cic")
    ctx.fillStyle = color
    ctx.beginPath();
    ctx.arc(px,py,RADIUS, 0, 2 * Math.PI);
    //ctx.stroke();

    ctx.fill();
    
}

function draw_players(ctx,lbp) {
    for (let i = 2; i < 10; i++) {
        lbp = lbp.toString().replace(new RegExp(i, 'g'), "0".repeat(i));
    }
    var board = lbp.split("/")
    console.log(board)

    for (let i = 0; i < board.length; i++) {
        for (let j = 0;j<board[i].length;j++) {
            if (board[i][j] != "0") {
                console.log(i,j)
                console.lo
                let y = HALF * (i+0.5) + THICK/2 //+ Math.max(0,i-1) * THICK
                let x = HALF * (j+0.5) + THICK/2//+ Math.max(0,j-1) * THICK

                circle(ctx,getColor(board[i][j]),x,y)
            }
        }
    }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export function master_draw(b10_board,lbp,move_power_left,) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0;i < 3;i++) {
    for (let j = 0;j<3;j++) {
        console.log(i,j)
        drawEmptyTile(ctx,i*FULL+5,j*FULL+5);
        
        }
    }

    for (let i = 0;i < 3;i++) {
        for (let j = 0;j<3;j++) {
            let ind = j*3+i
            drawWalls(ctx,b10_board[ind],i*FULL+5,j*FULL+5);
        }
    }
    draw_players(ctx,lbp)
    document.getElementById("mp").innerHTML = "Move power: " + move_power_left
}

export function setId(game_id) {
    document.getElementById("gameid").innerHTML = game_id 
}
