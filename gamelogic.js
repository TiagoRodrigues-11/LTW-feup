/**
 * Get a random number between min, max
 * @param {*} max Int: maximum number 
 * @param {*} min Int: minimum number 
 */
 function getRandomInt(min, max) {
    return (min + Math.floor(Math.random()*(max+1)));
}

const PVP = 0;
const RAND_BOT = 1;
const LVL_1_BOT = 2;

const PLAYER = 0;
const ADVERSARY = 1;


let contaParentUp   = document.getElementById("rowPUp");
let contaParentDown = document.getElementById("rowPDown");
let stParentLeft    = document.getElementById("colPLeft");
let stParentRight   = document.getElementById("colPRight");
let playButton      = document.getElementById("playBtn");
let seedSlider      = document.getElementById("seedSlider");
let holeSlider      = document.getElementById("holeSlider");
let seedNumber = seedSlider.value;
let holeNumber = holeSlider.value;
let seedNumberTemp = seedSlider.value;
let holeNumberTemp = holeSlider.value;
let mode = LVL_1_BOT;
let game = null;


// HA UM PROBLEMA COM ISTO...
holeSlider.oninput = function(){
    document.getElementById("demo1").innerHTML="Número de Buracos: " + holeSlider.value;
    holeNumberTemp = holeSlider.value;
}

seedSlider.oninput = function(){
    document.getElementById("demo2").innerHTML="Sementes: " + seedSlider.value;
    seedNumberTemp = seedSlider.value;
}

playButton.onclick = function() {


    while(contaParentUp.firstChild) {
        contaParentUp.removeChild(contaParentUp.firstChild);
    }
    while(contaParentDown.firstChild) {
        contaParentDown.removeChild(contaParentDown.firstChild);
    }
    while(stParentLeft.firstChild) {
        stParentLeft.removeChild(stParentLeft.firstChild);
    }
    while(stParentRight.firstChild) {
        stParentRight.removeChild(stParentRight.firstChild);
    }
    holeNumber = holeNumberTemp;
    seedNumber = seedNumberTemp;
    game = new Game();
    console.log(game);


}

class Hole {
    constructor(seedNumber, id){
        this.seedNumber =  seedNumber - '0';
        this.id = id;
        this.hole = document.getElementById(id);

        this.startSeed();
    }

    startSeed() {

        for(let i = 0; i < this.seedNumber && this.hole.id[0] === 'c';i++) {
            let seed = document.createElement("div");
            seed.classList.add("seed");
            seed.style.top = (getRandomInt(15, 50)).toString() + "%";
            seed.style.left = (getRandomInt(15, 50)).toString() + "%";
            let valueRan = "rotate(" + getRandomInt(0, 180).toString() + "deg)"
            seed.style.transform = valueRan;

            this.hole.appendChild(seed);
        }
    }

    empty() {
        return !this.seedNumber;
    }

    wasEmpty() {
        return this.seedNumber == 1;
    }

    addSeeds(seeds) {
        this.seedNumber += seeds;

        for(let i = 0; i < seeds;i++) {
            let seed = document.createElement("div");
            seed.classList.add("seed");
            seed.style.top = (getRandomInt(20, 40)).toString() + "%";
            seed.style.left = (getRandomInt(20, 40)).toString() + "%";
            let valueRan = "rotate(" + getRandomInt(0, 180).toString() + "deg)"
            seed.style.transform = valueRan;

            this.hole.appendChild(seed);
        }
    }

    removeSeed() {
        let seedNumberTemp = this.seedNumber;
        this.seedNumber = 0;

        while(this.hole.firstChild) {
            this.hole.removeChild(this.hole.firstChild);
        }

        return seedNumberTemp;
    }

    seed() {

    }
}

class StorageHole extends Hole {
    constructor(id) {
        super(0, id);
    }


}



class Row {

    constructor(row) {
        this.holes = [];
        this.row = row
        this.createHoles();

    }

    createHoles() {
        for(let i = 0; i < holeNumber; i++) {
            let container = document.createElement("div");
            container.id = 'c' + (i + this.row * holeNumber + 1);
            container.classList.add("hole");

            if(this.row)
                contaParentUp.insertBefore(container, contaParentUp.firstChild);
            else
                contaParentDown.appendChild(container);

            this.holes.push(new Hole(seedNumber, container.id));
        }

        let storageDiv = document.createElement("div");


        if(this.row) {
            storageDiv.id = "s2";
            storageDiv.classList.add("storageleft"); 
            stParentRight.appendChild(storageDiv);

        }
        else {
            storageDiv.id = "s1";
            storageDiv.classList.add("storageright"); 
            stParentLeft.appendChild(storageDiv);
        }

        this.holes.push(new StorageHole(storageDiv.id));

    }

    noSeeds() {
        for(let i = 0; i < holeNumber; i++) {
            if(!this.holes[i].empty()) return false;
        }
        return true;
    }

    hole(holeId) {
        for(let i = 0; i < holeNumber; i++) {
            if(this.holes[i].id === holeId)
                return this.holes[i];
        }
        return null;
    }

    index(holeId) {
        for(let i = 0; i < holeNumber; i++) {
            if(this.holes[i].id === holeId)
                return i;
        }
        return null;
    }

    elem(holeId) {
        for(let i = 0; i < holeNumber; i++) {
            if(holeId === this.holes[i].id)
                return true;
        }
        return false;
    }

}

class Game {
    constructor() {
        this.bottomRow = new Row(PLAYER);
        this.topRow = new Row(ADVERSARY);
        this.turn = PLAYER;
        this.setup();
    }


    seed(holeId) {

        if(holeId[0] === 's') return;

        let nSeed = this.searchHole(holeId).removeSeed();

        if(nSeed === 0) {
            console.log("Empty hole!");
            return null;
        }
        for(let i = 0; i < nSeed; i++) {
            holeId = this.nextHole(holeId);

            // Nao semear no storage contrario
            if(this.turn === PLAYER && holeId === "s2") {
                holeId = this.nextHole(holeId);
            }
            if(this.turn === ADVERSARY && holeId === "s1") {
                holeId = this.nextHole(holeId);
            }

            this.searchHole(holeId).addSeeds(1);

        }

        return holeId;
    }

    searchHole(holeId){
        if(holeId === "s1") 
            return this.bottomRow.holes[holeNumber];
        if(holeId === "s2")
            return this.topRow.holes[holeNumber];

        for(let i = 0; i < holeNumber; i++) {
            if(this.bottomRow.holes[i].id === holeId) {
                return this.bottomRow.holes[i];
            }
        }

        for(let i = 0; i < holeNumber; i++) {
            if(this.topRow.holes[i].id === holeId) {
                return this.topRow.holes[i];
            }
        }
        return null;
    }

    nextHole(holeId) {
        if(holeId === "s1") 
            return this.topRow.holes[0].id;
        if(holeId === "s2")
            return this.bottomRow.holes[0].id;

        for(let i = 0; i < holeNumber; i++) {
            if(this.bottomRow.holes[i].id === holeId) {
                return this.bottomRow.holes[i+1].id;
            }
        }

        for(let i = 0; i < holeNumber; i++) {
            if(this.topRow.holes[i].id === holeId) {
                return this.topRow.holes[i+1].id;
            }
        }
        return null;
    }

    setup() {
        if(mode === PVP) {
            for(let i = 0; i < holeNumber; i++) {
                let holeTemp = this.topRow.holes[i];
                
                holeTemp.hole.onclick = function() {
                    if(game.turn && !holeTemp.empty()) {
                        let temp = game.seed(holeTemp.id);
                        if(terminate()) decideWinner();
                        if(temp != "s2") {
                            let indexTemp = game.bottomRow.index(temp);
                            if(game.searchHole(temp).wasEmpty() && game.topRow.elem(temp) && !game.bottomRow.holes[holeNumber-indexTemp-1].empty()) {
                                game.topRow.holes[holeNumber].addSeeds(game.bottomRow.holes[holeNumber-indexTemp-1].removeSeed());
                                game.topRow.holes[holeNumber].addSeeds(game.topRow.hole(temp).removeSeed());
                            }
                            game.turn = PLAYER;
                        }
                    }
                }
            }
        }

        for(let i = 0; i < holeNumber; i++) {
            let holeTemp = this.bottomRow.holes[i];
            holeTemp.hole.onclick = function() {
                if(!game.turn && !holeTemp.empty()) {4

                    let temp = game.seed(holeTemp.id);
                    if(terminate()) decideWinner();
                    if(temp != "s1") {

                        let indexTemp = game.bottomRow.index(temp);
                        if(game.searchHole(temp).wasEmpty() && game.bottomRow.elem(temp) && !game.topRow.holes[holeNumber-indexTemp-1].empty()) {
                            game.bottomRow.holes[holeNumber].addSeeds(game.topRow.holes[holeNumber-indexTemp-1].removeSeed());
                            game.bottomRow.holes[holeNumber].addSeeds(game.bottomRow.hole(temp).removeSeed());
                        }
                        game.turn = ADVERSARY;
                        switch(mode) {
                            case RAND_BOT:
                                setTimeout(botPlay, 1000);
                            case LVL_1_BOT:
                                console.log(bot(null));
                        }
                    }
                }
            }
        }
    }

    
}



function botPlay(index = null, gameBot = game) {
    while(true) {
        let i = getRandomInt(0, holeNumber-1);
        if(index != null) i = index;
        
        let holeTemp = gameBot.topRow.holes[i];
        if(holeTemp.empty()) continue;
        let temp = gameBot.seed(holeTemp.id);
        if(temp === "s2") {
            setTimeout(botPlay, 1000);
        }
        let indexTemp = gameBot.bottomRow.index(temp);
        if(gameBot.searchHole(temp).wasEmpty() && gameBot.topRow.elem(temp) && !game.bottomRow.holes[holeNumber-indexTemp-1].empty()) {
            gameBot.topRow.holes[holeNumber].addSeeds(gameBot.bottomRow.holes[holeNumber-indexTemp-1].removeSeed());
            gameBot.topRow.holes[holeNumber].addSeeds(gameBot.topRow.hole(temp).removeSeed());
        }
        if(terminate()) decideWinner();
        gameBot.turn = PLAYER;
        return;
    }
} 

function terminate() {
    if(game.turn == PLAYER) {
        if(game.topRow.noSeeds()) {
            let newSeeds = 0;
            for(let i = 0; i < holeNumber; i++) {
                newSeeds += game.bottomRow.holes[i].removeSeed();
            }
            game.bottomRow.holes[holeNumber].addSeeds(newSeeds);
            return true;
        }
    } else {
        if(game.bottomRow.noSeeds()) {
            let newSeeds = 0;
            for(let i = 0; i < holeNumber; i++) {
                newSeeds += game.topRow.holes[i].removeSeed();
            }

            game.topRow.holes[holeNumber].addSeeds(newSeeds);
            return true;
        }
        
    }
    return false;
}

function decideWinner() {
    let playerSeeds = game.bottomRow.holes[holeNumber].seedNumber;
    let adversarySeeds = game.topRow.holes[holeNumber].seedNumber;

    if(playerSeeds > adversarySeeds) {
        console.log("PLayer won!");
    } else if (playerSeeds === adversarySeeds) {
        console.log("Draw!");
    } else {
        console.log("Adversary won!");
    }

    game.turn = null;
}

function bot(depth) {
    let maxSeedsIndex = -1, maxSeeds = -1;

    for(let i = 0; i < holeNumber; i++) {
        let gameClone = JSON.parse(JSON.stringify(game                  ));
        botPlay(i, gameClone);
        let num = gameClone.topRow.holes[holeNumber].seedNumber;
        console.log(num + " " + maxSeedsIndex + ":" + maxSeeds);

        if(num > maxSeeds) {
            maxSeedsIndex = i;
            maxSeeds = num;
        }
    }

    return maxSeedsIndex;
}