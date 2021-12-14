

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
let seedNumber = seedSlider.value, holeNumber = holeSlider.value;
let mode = RAND_BOT;
let game = null;



holeSlider.oninput = function(){
    document.getElementById("demo1").innerHTML="Número de Buracos: " + holeSlider.value;
    holeNumber = holeSlider.value;
}

seedSlider.oninput = function(){
    document.getElementById("demo2").innerHTML="Sementes: " + seedSlider.value;
    seedNumber = seedSlider.value;
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

}

class Game {
    constructor() {
        this.bottomRow = new Row(PLAYER);
        this.topRow = new Row(ADVERSARY);
        this.turn = PLAYER;
        this.play();
    }


    seed(holeId) {

        if(holeId[0] === 's') return;

        let nSeed = this.searchHole(holeId).removeSeed();

        if(nSeed === 0) {
            console.log("Empty hole!");
            return null;
        }

        let seed = 1;
        for(let i = 0; i < nSeed; i++) {
            holeId = this.nextHole(holeId);
            if(i==nSeed-1 && holeId!=="s1" && holeId!=="s2"){
                let tmp = this.searchHole(holeId);
                if(tmp.empty()){
                    let numSeed=1;
                    //Adversário
                    if(this.turn){
                        //console.log("c"+(parseInt(holeNumber)*2 - (parseInt(holeId[1],10)-1)));
                        numSeed+=this.searchHole("c"+(parseInt(holeNumber)*2 - (parseInt(holeId[1],10)-1))).removeSeed();
                        this.searchHole("s2").addSeeds(numSeed);
                    }else{
                        //console.log("player");
                        numSeed+=this.searchHole("c"+(parseInt(holeNumber)*2 - (parseInt(holeId[1],10)-1))).removeSeed();
                        this.searchHole("s1").addSeeds(numSeed);
                    }
                    seed=0;
                }
            }
            
            this.searchHole(holeId).addSeeds(seed);

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

    play() {
        if(mode === PVP) {
            for(let i = 0; i < holeNumber; i++) {
                let holeTemp = this.topRow.holes[i];
                holeTemp.hole.onclick = function() {
                    if(game.turn && !holeTemp.empty()) {
                        game.seed(holeTemp.id);
                        game.turn = PLAYER;
                    }
                }
            }
        }
        
        for(let i = 0; i < holeNumber; i++) {
            let holeTemp = this.bottomRow.holes[i];
                holeTemp.hole.onclick = function() {
                if(!game.turn && !holeTemp.empty() && !terminate()) {
                    game.seed(holeTemp.id);
                    game.turn = ADVERSARY;
                    switch(mode) {
                        case RAND_BOT:
                            setTimeout(randomBot,1000);
                    }
                }
            }
        }
        
    }
}

function terminate(){
    let seed=0;
    if(game.topRow.noSeeds()){
        for(let i=0; i<holeNumber; i++){
            let holeTemp = game.bottomRow.holes[i];
            seed+=holeTemp.removeSeed();
        }
        game.bottomRow.holes[holeNumber].addSeeds(seed);
        console.log("terminado player com " + game.bottomRow.holes[holeNumber].seedNumber);
        console.log("terminado adversário com " + game.topRow.holes[holeNumber].seedNumber);
    }
    else if(game.bottomRow.noSeeds()){
        for(let i=0; i<holeNumber; i++){
            let holeTemp = game.topRow.holes[i];
            seed+=holeTemp.removeSeed();
        }
        game.topRow.holes[holeNumber].addSeeds(seed);
        console.log("terminado player com " + game.bottomRow.holes[holeNumber].seedNumber);
        console.log("terminado adversário com " + game.topRow.holes[holeNumber].seedNumber);
    }

    return game.topRow.noSeeds() || game.bottomRow.noSeeds()
}

function randomBot() {
    
    if(game.topRow.noSeeds()) return true;
    let stop = false;
    while(!stop) {
        let holeTemp = game.topRow.holes[getRandomInt(0, holeNumber-1)];
        if(holeTemp.empty()) continue;
        game.seed(holeTemp.id);
        game.turn = PLAYER;
        break;
    }
    return false;
}



