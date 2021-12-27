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
const BEST_BOT = 2;

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
let mode = BEST_BOT;
let game = null;


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
    constructor(seedNumber, id, clone = false){
        this.seedNumber =  seedNumber - '0';
        this.id = id;
        this.cloneH = clone;

        if(!clone) {
            this.hole = document.getElementById(id);
            this.update();
            this.startSeed();
        }
        
    }

    update(){
        if(this.cloneH) return;
        this.hole.innerHTML = this.seedNumber;
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

    clone() {
        return new Hole(this.seedNumber, this.id, true)
    }

    empty() {
        return !this.seedNumber;
    }

    wasEmpty() {
        return this.seedNumber == 1;
    }

    addSeeds(seeds) {
        let childs = [];
        this.seedNumber += seeds;
        
        
        while(!this.cloneH && this.hole.firstChild){
            childs.push(this.hole.removeChild(this.hole.firstChild));
        }

        this.update();
        for(let i = 0; i < this.seedNumber && !this.cloneH; i++) {
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

        while(!this.cloneH && this.hole.firstChild) {
            this.hole.removeChild(this.hole.firstChild);
        }

        return seedNumberTemp;
    }

}

class StorageHole extends Hole {
    constructor(id, clone = false) {
        super(0, id, clone);
    }

    clone() {
        let storageClone = new StorageHole(this.id, true);
        storageClone.seedNumber = this.seedNumber;

        return storageClone;
    }
}



class Row {

    constructor(row, clone = false) {
        this.holes = [];
        this.row = row
        if(!clone) this.createHoles();

    }

    clone() {
        let rowClone = new Row(this.row, true);

        for(let i = 0; i <= holeNumber; i++) {
            rowClone.holes[i] = this.holes[i].clone();
        }

        return rowClone;
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
    constructor(turn = PLAYER, clone = false) {
        this.bottomRow = new Row(PLAYER, clone);
        this.topRow = new Row(ADVERSARY, clone);
        this.turn = turn;
        if(!clone) this.setup();
    }

    clone() {
        let gameClone = new Game(ADVERSARY, true);

        gameClone.bottomRow = this.bottomRow.clone();
        gameClone.topRow = this.topRow.clone();

        return gameClone;

    }

    bestMove(g = this){
        let index = [-1], maxSeed = -1;

        for(let i = holeNumber - '0' + 1 ; i <= 2*(holeNumber-'0'); i++) {
            // Declaraçao das variaveis
            let indexTemp = [], maxSeedTemp = 0;
            let gameClone = g.clone();
            if(maxSeed === -1) maxSeed = gameClone.seedStorage(gameClone.topRow);
            let holeId = gameClone.seed('c' + i, gameClone);

            // Caso o buraco esteja vazia, vai para o proximo
            if(holeId === null) {
                continue;
            }

            // Caso calha no storage, joga de novo
            if(holeId === 's2') {
                let temp = gameClone.bestMove(gameClone);
                for(let j = 0; j < temp[0].length; j++) indexTemp.push(temp[0][j]);
                maxSeedTemp = temp[1] - gameClone.seedStorage(gameClone.topRow);
            }

            gameClone.updateEmptyHole(gameClone, gameClone.topRow, gameClone.bottomRow, holeId);

            // Ver quem tem mais sementes no storage
            if((gameClone.seedStorage(gameClone.topRow) + maxSeedTemp) > maxSeed) {
                index[0] = i;

                for(let j = 0; j < indexTemp.length; j++) 
                    index.push(indexTemp[j]);

                maxSeed = gameClone.seedStorage(gameClone.topRow) + maxSeedTemp;
            }

        }

        if(index[0] === -1){
            for(let i = holeNumber - '0' + 1 ; i <= 2*(holeNumber-'0'); i++) {
                if(!g.searchHole('c' + i, g).empty()) {
                    return [[i], maxSeed];
                }
            }
        }
        return [index, maxSeed];
    }

    seedStorage(row) {
        return row.holes[holeNumber].seedNumber;
    }

    seed(holeId, g = this) {

        if(holeId[0] === 's') return;
        let nSeed = g.searchHole(holeId, g).removeSeed();

        if(nSeed === 0 && this.turn == PLAYER) {
            console.log("Empty hole!");
            return null;
        }
        for(let i = 0; i < nSeed; i++) {
            holeId = g.nextHole(holeId, g);
            
            // Nao semear no storage contrario
            if(g.turn === PLAYER && holeId === "s2") {
                holeId = g.nextHole(holeId, g);
            }
            if(g.turn === ADVERSARY && holeId === "s1") {
                holeId = g.nextHole(holeId, g);
            }
            g.searchHole(holeId, g).addSeeds(1);

        }

        return holeId;
    }

    searchHole(holeId, g = this){

        if(holeId === "s1") 
            return g.bottomRow.holes[holeNumber];
        if(holeId === "s2")
            return g.topRow.holes[holeNumber];

        for(let i = 0; i < holeNumber; i++) {
            if(g.bottomRow.holes[i].id === holeId) {
                return g.bottomRow.holes[i];
            }
        }

        for(let i = 0; i < holeNumber; i++) {
            if(g.topRow.holes[i].id === holeId) {
                return g.topRow.holes[i];
            }
        }
        return null;
    }

    nextHole(holeId, g = this){
        if(holeId === "s1") 
            return g.topRow.holes[0].id;
        if(holeId === "s2")
            return g.bottomRow.holes[0].id;

        for(let i = 0; i < holeNumber; i++) {
            if(g.bottomRow.holes[i].id === holeId) {
                return g.bottomRow.holes[i+1].id;
            }
        }

        for(let i = 0; i < holeNumber; i++) {
            if(g.topRow.holes[i].id === holeId) {
                return g.topRow.holes[i+1].id;
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

                            game.updateEmptyHole(game, game.topRow, game.bottomRow, temp);
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

                        game.updateEmptyHole(game, game.bottomRow, game.topRow, temp);
                        game.turn = ADVERSARY;

                        switch(mode) {
                            case RAND_BOT:
                                setTimeout(randPlay, 1000);
                                break;
                            case BEST_BOT:
                                setTimeout(bestPlay, 1000);
                                break;
                        }
                    }
                }
            }
        }
    }

    updateEmptyHole(board, myRow, otherRow, hole) {
        let index = myRow.index(hole);
        // JIC: && !board.otherRow.holes[holeNumber-indexTemp-1].empty()
        if(board.searchHole(hole).wasEmpty() && myRow.elem(hole)) {
            myRow.holes[holeNumber].addSeeds(otherRow.holes[holeNumber-index-1].removeSeed());
            myRow.holes[holeNumber].addSeeds(myRow.holes[index].removeSeed());
            return true;
        }
        
        return false;
    }
    
}

function bestPlay(){
    // temp = ["Array com jogadas", "Sementes no Storage(Nao importante para aqui)"];

    let moves = game.bestMove()[0];
    for(let i = 0; i < moves.length; i++) {
        let temp = game.seed('c' + moves[i]);
        
        game.updateEmptyHole(game, game.topRow, game.bottomRow, temp);
        if(terminate()) decideWinner();
    }
    if(terminate()) decideWinner();
    game.turn = PLAYER;

    return;
}


function randPlay() {
    while(true) {
        let i = getRandomInt(0, holeNumber-1);

        let holeTemp = game.topRow.holes[i];
        if(holeTemp.empty()) continue;
        let temp = game.seed(holeTemp.id);
        if(temp === "s2") {
            setTimeout(randPlay, 1000);
        }

        game.updateEmptyHole(game, game.topRow, game.bottomRow, temp);

        if(terminate()) decideWinner();
        game.turn = PLAYER;
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