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
let seedNumber;
let holeNumber;
let seedNumberTemp = seedSlider.value;
let holeNumberTemp = holeSlider.value;
let modeTemp = RAND_BOT;
let mode;
let game = null;

let nivelDificuldade = document.getElementById("nivelDificuldade");
let modoJogo = document.getElementById("modoJogo"); 



/*Servidor */
let nick;
let pass;
const group = 64;
let gameId;
let eventSource;

let login=false;
let startGame=true;
let endGame=false;

let loginForm = document.getElementById("login");
let createAccountForm = document.getElementById("createAccount");
let Register = document.getElementById("Register");
let Login = document.getElementById("Login");




nivelDificuldade.oninput = function(){
    const v = modoJogo.value;
    if(v==="Adversário") modeTemp=PVP;
    else if ( v==="Robô"){
        const d = nivelDificuldade.value;
        if(d==="Fácil") modeTemp=RAND_BOT;
        else if (d==="Difícil") modeTemp=BEST_BOT;
    }
    console.log(modeTemp);
}

modoJogo.oninput = function(){
    const v = modoJogo.value;
    if(v==="Adversário") modeTemp=PVP;
    else if ( v==="Robô"){
        const d = nivelDificuldade.value;
        if(d==="Fácil") modeTemp=RAND_BOT;
        else if (d==="Difícil") modeTemp=BEST_BOT;
    }
    console.log(modeTemp);
}


holeSlider.oninput = function(){
    document.getElementById("demo1").innerHTML="Número de Buracos: " + holeSlider.value;
    holeNumberTemp = holeSlider.value;
}

seedSlider.oninput = function(){
    document.getElementById("demo2").innerHTML="Sementes: " + seedSlider.value;
    seedNumberTemp = seedSlider.value;
}


playButton.onclick = function() {
    if(playButton.innerHTML==="Desistir") game.gameOver();
    else if(modeTemp!==PVP){
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
        mode = modeTemp;
        game = new Game();
        console.log(game);
        playButton.innerHTML = "Desistir";
    }
    
    else if(modeTemp===PVP){
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
        mode = modeTemp;
        holeNumber = holeNumberTemp;
        seedNumber = seedNumberTemp;
        join(holeNumber, seedNumber);
    }

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

    gameOver() {
        this.hole.parentNode.removeChild(this.hole);

        delete this.seedNumber;
        delete this.id;
        delete this.hole;
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
        this.update();
        
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

    gameOver() {
        for(let i = 0; i <= holeNumber; i++) {
            this.holes[i].gameOver();
        }
        this.holes = null;
        this.row = null;
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
            // Ver quem tem mais sementes no storage
            if((gameClone.seedStorage(gameClone.topRow) + maxSeedTemp) > maxSeed) {
                index = [];
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
                let holeTemp = this.bottomRow.holes[i];
                holeTemp.hole.onclick = function() {
                    if(!game.turn && !holeTemp.empty()) {
                        let temp = game.seed(holeTemp.id);

                        if(endGame) decideWinner();

                        if(temp != "s1") {
                            
                            game.updateEmptyHole(game, game.bottomRow, game.topRow, temp);
                            //game.turn = ADVERSARY;

                            //pvpPlay();
                        }
                        notify(parseInt(holeTemp.id[1])-1);
                        if(endGame) decideWinner();
                    }
                }
            }
        }
        else{
            for(let i = 0; i < holeNumber; i++) {
                let holeTemp = this.bottomRow.holes[i];
                holeTemp.hole.onclick = function() {
                    if(!game.turn && !holeTemp.empty()) {
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
                        if(game.bottomRow.noSeeds() && game.turn === PLAYER && terminate(true)) {
                            decideWinner();
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

    gameOver() {
        if(mode===PVP) leave();
        game.bottomRow.gameOver();
        game.topRow.gameOver();
        playButton.innerHTML="Novo Jogo";
    }
    
}

function bestPlay(){
    // temp = ["Array com jogadas", "Sementes no Storage(Nao importante para aqui)"];
    let moves = game.bestMove()[0];
    console.log(moves);
    for(let i = 0; i < moves.length; i++) {
        if(moves[i] === -1 && terminate(true))
            decideWinner();

        let temp = game.seed('c' + moves[i]);
        
        game.updateEmptyHole(game, game.topRow, game.bottomRow, temp);
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

        if(game.topRow.noSeeds() && game.turn === ADVERSARY && terminate(true)) {
            decideWinner();
        }
        return;
    }
} 

function pvpPlay(pit){
        let i = pit;

        let holeTemp = game.topRow.holes[i];
        let temp = game.seed(holeTemp.id);

        game.updateEmptyHole(game, game.topRow, game.bottomRow, temp);

        if(endGame) decideWinner();
        //game.turn = PLAYER;

        return;
}

function terminate(force = false) {
    if(force) {
        let newSeedsTop = 0, newSeedsBottom = 0;
        for(let i = 0; i < holeNumber; i++) {
            newSeedsTop += game.topRow.holes[i].removeSeed();
            newSeedsBottom += game.bottomRow.holes[i].removeSeed();
        }
        game.bottomRow.holes[holeNumber].addSeeds(newSeedsBottom);
        game.topRow.holes[holeNumber].addSeeds(newSeedsTop);
        return true;
    }
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

function decideWinner(winner = null) {
    if(winner !== null) {
        if(winner === PLAYER)
            console.log("PLayer won!");
        else
            console.log("Adversary won!");

        game.gameOver();
        game.turn = null;
        startGame=true;
        return;
    }

    let playerSeeds = game.bottomRow.holes[holeNumber].seedNumber;
    let adversarySeeds = game.topRow.holes[holeNumber].seedNumber;

    if(playerSeeds > adversarySeeds) {
        console.log("PLayer won!");
    } else if (playerSeeds === adversarySeeds) {
        console.log("Draw!");
    } else {
        console.log("Adversary won!");
    }

    game.gameOver();
    game.turn = null;
    startGame=true;
}





/*funções da parte do servidor */

document.addEventListener("DOMContentLoaded", ()=>{

    document.getElementById("linkCreateAccount").addEventListener("click", ()=>{
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.getElementById("linkLogin").addEventListener("click", ()=>{
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

});

Register.onclick = function(){
    let EmailReg = document.getElementById("createEmail");
    let PassReg = document.getElementById("createPass");
    const createEmail = EmailReg.value;
    const createPass = PassReg.value;

    modal[0].style.display = "none";

    register(createEmail, createPass);
}

Login.onclick = function(){
    let EmailLog = document.getElementById("loginEmail");
    let PassLog = document.getElementById("loginPassword");
    const loginEmail = EmailLog.value;
    const loginPass = PassLog.value;

    modal[0].style.display = "none";

    register(loginEmail, loginPass);
}


function register(email, password){
    nick=email;
    pass = password;
    const registar = {
        "nick": email,
        "password": password
    }

    fetch("http://twserver.alunos.dcc.fc.up.pt:8008/register",{
        method: 'POST',
        body: JSON.stringify(registar),
    })
    .then(function(response) {
        if(response.ok) {
            nick=email;
            pass=password;
            login=true;
            alert("You´re Logged In!");
            console.log(nick + " " + pass);
        } else{
            console.log('erro: ' + response.status + ": " +  response.statusText);  
         }
     })
    .catch(console.log);
    
}

function ranking(){
    fetch("http://twserver.alunos.dcc.fc.up.pt:8008/ranking", {
        method: "POST",
        body: JSON.stringify({})
    })
    .then(function(response){
        if(response.ok) {
            return response.json();
        } else{
           console.log('erro: ' + response.status + ": " +  response.statusText);  
        }
    })
    .then(function(data){
        console.log(data);
    })
}

function join(cavidades, sementes){
    if(!login) alert("Please loggin first!");
    else{
        const juntar = {
            "group": group,
            "nick": nick,
            "password": pass,
            "size": cavidades,
            "initial": sementes
        }

        fetch("http://twserver.alunos.dcc.fc.up.pt:8008/join",{
            method: 'POST',
            body: JSON.stringify(juntar),
        })
        .then(function(response) {
            if(response.ok) {
                return response.json();
            } else{
            console.log('erro: ' + response.status + ": " +  response.statusText);  
            }
        })
        .then(function(data){
            gameId=data.game;
            console.log(gameId);
            update();
        })
        .catch(console.log);
    }
}

function leave(){
    const desistir = {
        "game": gameId,
        "nick": nick,
        "password": pass
    }

    fetch("http://twserver.alunos.dcc.fc.up.pt:8008/leave",{
        method: 'POST',
        body: JSON.stringify(desistir),
    })
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } else{
           console.log('erro: ' + response.status + ": " +  response.statusText);  
        }
     })
     .then(function(data){
         console.log("desistir");
         console.log(data);
     })
    .catch(console.log);
}

function notify(move){
    const notificar = {
        "nick": nick,
        "password": pass,
        "game": gameId,
        "move": move
    }

    fetch("http://twserver.alunos.dcc.fc.up.pt:8008/notify",{
        method: 'POST',
        body: JSON.stringify(notificar),
    })
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } else{
           console.log('erro: ' + response.status + ": " +  response.statusText);  
        }
     })
    .catch(console.log);
}

let again=0;

function update(){
    eventSource = new EventSource("http://twserver.alunos.dcc.fc.up.pt:8008/update?nick=" + encodeURIComponent(nick) + "&game=" + encodeURIComponent(gameId));
    eventSource.onmessage = function(event){
        const data = JSON.parse(event.data);
        console.log(data);
        if(data.hasOwnProperty("winner")){
            if(data.winner==null) alert("Desistiu do jogo")
            else{
                if(data.winner==nick) winner=PLAYER;
                else winner=ADVERSARY;
                endGame = true;
                console.log("Jogo Termina");
                decideWinner(winner);
            }
        }
        else if(data.hasOwnProperty("board")){
            if(startGame) {
                console.log("Jogo começa");
                game = new Game();
                console.log(game);
                startGame=false;
                playButton.innerHTML = "Desistir";
            }

            const pit = data.pit;
            if(pit){
                console.log(pit);
                if(game.turn===ADVERSARY){ 
                     pvpPlay(pit);
                }
            }

            const turn = data.board.turn;
            if(turn===nick) {
                game.turn=PLAYER;
                again=1;
                console.log("Your turn!");
            }
            else{
                again=0;
                game.turn=ADVERSARY;
            }

            

        }
        
    }
}
