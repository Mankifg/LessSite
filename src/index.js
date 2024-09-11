import { master_draw, setId} from "./draw.js";
import {getCookie, setCookie} from "./cookie_hand.js"

const FULL = 150;
const THICK = 9;
const HALF = FULL/2;
const RADIUS = 20
const BINARY_LEN = 12;
const INT_MAX = Math.pow(2, BINARY_LEN);

var SCALE = 0.8
var ORIGINX = 0
var ORIGINY = 0
var MAXX = 3 * FULL * SCALE
var MAXY = 3 * FULL * SCALE
var N = 6
var WIDTHX = (3 * FULL / N) * SCALE
var WIDTHY =  (3 * FULL / N) * SCALE
const FILES = "abcdef";

function find_position(x,y) {
    return [Math.floor(x / WIDTHX),Math.floor(y / WIDTHY),]  
}

function fuck_js_are_two_ary_same(a1,a2) {
    console.log("got to f js",a1,a2)
    for (let i = 0;i<a1.length;i++) {
        if (a1[i] != a2[i]) {
            return false
        }
    }
    return true
}

function fromArryNotation(arry) {
    console.log("adddd",arry.length)
    if (arry.length != 4) {
        return [false, "Len != 4"];
    }

    let [x1, y1, x2, y2] = arry;

    x1 = FILES[x1];
    x2 = FILES[x2];
    y1 = 6 - y1;
    y2 = 6 - y2;

    return [true, `${x1}${y1}${x2}${y2}`];
}

async function push_move(arry) {
    console.log(arry)
    var [succes,not] = fromArryNotation(arry);
    if (!succes) {
        console.log("errror");
    }
    document.getElementById("move").innerHTML = not
    var ident = getCookie("ident")
    var game_obj = await get_url(BASE_URL + `/make_move?game_id=${game_id}&move=${not}&ident=${ident}`)

    console.log("new game obj  ffddscdvds",game_obj)

    if (!game_obj.s) {
        document.getElementById("info").innerHTML = game_obj.code

    } else {
            if (game_obj.game_end) {
                var win = "White"
                if (game_obj.win == -1) {
                    win = "Black"
                }
                alert("Winner: " + win)
                window.location.reload()
            }


        master_draw(game_obj.b10_board, game_obj.lbp,game_obj.move_power)

    }
}


async function get_url(url) {
    let r = await fetch(url)
    return await r.json();
  }

var playing = false
const BASE_URL = "http://127.0.0.1:8000"
var game_id  = 0;
window.new_game = async function() {
    playing = true;
    var new_obj = await get_url(BASE_URL + "/new_game")
    game_id = new_obj.game_id
    
    master_draw(new_obj.board, new_obj.lbp,new_obj.move_power)
    setId(game_id)

    setCookie("ident",new_obj.ident)
    setCookie("you",new_obj.you)
}

window.join_game = async function() {
    game_id = prompt("Enter game id:")
    var join_obj = await get_url(BASE_URL + "/join_game?game_id=" + game_id)

    if (!join_obj.s) {
        alert("No game found with that id")
        window.location.reload()
        return
    }
    alert("Game found")
    playing = true;
    setCookie("ident",join_obj.ident)
    setCookie("you",join_obj.you)


    game_id = join_obj.game_id
    master_draw(join_obj.board, join_obj.lbp,join_obj.move_power)
    setId(game_id)


}

var save_board 
var save_lbp
var save_move_power


async function get_board_state() {
    if (playing) {

    var got_obj = await get_url(BASE_URL + "/game?game_id=" + game_id)
    if (!got_obj.s) {
        console.log("not found")
        return
    }
    if (got_obj.game_end) {
        var win = "White"
        if (got_obj.win == -1) {
            win = "Black"
        }
        alert("Winner: " + win)
        playing = false
        window.location.reload()
    }

    
    if (!(got_obj.lbp == save_lbp ||got_obj.move_power == save_move_power)) {
    console.log("a")
    master_draw(got_obj.board, got_obj.lbp, got_obj.move_power)
    save_lbp = got_obj.lbp
    got_obj.move_power = save_move_power
    }
     
    var you = getCookie("you")

    if (you == got_obj.player_color) {
        document.getElementById("info").innerHTML = "Your move"
    } else {
        console.log(you,got_obj.player_color)
        document.getElementById("info").innerHTML = "Not your move"
    }
}
}

var selected = [];
document.addEventListener('click', (event) => {
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    if (mouseX < ORIGINX || mouseX > MAXX || mouseY < ORIGINY || mouseY > MAXY) {
        console.log("out of bound")
        selected = []
        return
    }  

    console.log(mouseX,mouseY);

    //document.getElementById("info").innerHTML = `${mouseX}, ${mouseY}`

    var pos = find_position(mouseX,mouseY);

    //console.log(pos)
    //console.log(selected)
    
    if ((selected != undefined) && (pos != undefined)) {
    if (fuck_js_are_two_ary_same(selected,pos)) {
        console.log("deselect",selected,pos)
        selected = []
    } 
    }
    if ((selected != undefined) && (pos != undefined)) {
    if ((selected.length == 2) && (pos.length == 2)) {
        var mov = selected.concat(pos)
        console.log("move",mov)
        push_move(mov)
        pos = [];
        selected = [];
        return
    }
}
    if ((selected != undefined)) {
    if (selected.length == 0) {
        //console.log("set selected to ",pos)
        selected = pos
    }
    }
    
});

setInterval(get_board_state, 500);