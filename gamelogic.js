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

let rank = {nick: "Jogador", win: 0, games: 0};

let fixedUp = document.getElementById("fixedUpId");
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


let turnBox = document.createElement("div");
turnBox.id = "turnBox";
turnBox.classList.add("turnBox");

let winnerBox = document.createElement("div");
winnerBox.id = "winnerBox";
winnerBox.classList.add("winnerBox");

let winnerText = document.createElement("div");
winnerText.id = "winnerText";
winnerText.classList.add("winnerText");

nivelDificuldade.oninput = function(){
    const v = modoJogo.value;
    if(v==="Adversário") modeTemp=PVP;
    else if ( v==="Robô"){
        const d = nivelDificuldade.value;
        if(d==="Fácil") modeTemp=RAND_BOT;
        else if (d==="Difícil") modeTemp=BEST_BOT;
    }
}

modoJogo.oninput = function(){
    const v = modoJogo.value;
    if(v==="Adversário") modeTemp=PVP;
    else if ( v==="Robô"){
        const d = nivelDificuldade.value;
        if(d==="Fácil") modeTemp=RAND_BOT;
        else if (d==="Difícil") modeTemp=BEST_BOT;
    }
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
    if(playButton.innerHTML==="Desistir"){
        if(game===null) {
            leave(gameId, nick, pass);
            playButton.innerHTML="Novo Jogo";
        }
        else if(mode !== PVP) {
            switch(game.turn) {
                case PLAYER:
                    decideWinner(ADVERSARY);
                    break;
                case ADVERSARY:
                    decideWinner(PLAYER);
                    break;
                default:
                    console.log("Error: game.turn = " + game.turn);
                    break;  
            }
        }
        else if(mode === PVP) {
            leave(gameId, nick, pass);
            playButton.innerHTML="Limpar";
        }
        else return;

    }
    else if (playButton.innerHTML === "Limpar") {
        game.gameOver();
        let child = fixedUp.childNodes;
        for(let i = 0; i < child.length; i++) {
            if(child[i].id === "winnerBox") {
                fixedUp.removeChild(child[i]);
                break;
            }
        }
        playButton.innerHTML="Novo Jogo";
    }
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
        
        // Change to turn
        turnBox.innerHTML = "Your Turn";

        holeNumber = holeNumberTemp;
        seedNumber = seedNumberTemp;
        mode = modeTemp;
        game = new Game();

        playButton.innerHTML = "Desistir";
    } else if(modeTemp===PVP) {
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
        join(group, nick, pass, holeNumber, seedNumber);
        if(login) playButton.innerHTML = "Desistir";
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
        if(this.holes === null) return;
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
        fixedUp.appendChild(turnBox);
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
                        
                        if(endGame && terminate()){
                            decideWinner();
                        }
                        if(temp != "s1") {
                            game.updateEmptyHole(game, game.bottomRow, game.topRow, temp);
                        }
                        notify(nick, pass, gameId, parseInt(holeTemp.id[1])-1);
                        
                        if(endGame && terminate()){
                            decideWinner();
                        }
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
                            turnBox.innerHTML = "Bot turn";
                            game.turn = ADVERSARY;

                            switch(mode) {
                                case RAND_BOT:
                                    setTimeout(randPlay, 500);
                                    break;
                                case BEST_BOT:
                                    setTimeout(bestPlay, 500);
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
        if(game !== null){
            game.bottomRow.gameOver();
            game.topRow.gameOver();
            endGame=false;
            playButton.innerHTML="Novo Jogo";

            
        }
        
    }
    
}

function bestPlay(){
    // temp = ["Array com jogadas", "Sementes no Storage(Nao importante para aqui)"];
    let moves = game.bestMove()[0];
    for(let i = 0; i < moves.length; i++) {
        if(moves[i] === -1 && terminate(true))
            decideWinner();

        let temp = game.seed('c' + moves[i]);
        
        game.updateEmptyHole(game, game.topRow, game.bottomRow, temp);
    }
    if(terminate()) decideWinner();
    game.turn = PLAYER;
    turnBox.innerHTML = "Your turn";

    return;
}


function randPlay() {
    if(terminate()) {
        decideWinner();
        return;
    }
    while(true) {
        let i = getRandomInt(0, holeNumber-1);

        let holeTemp = game.topRow.holes[i];
        if(holeTemp.empty()) continue;
        let temp = game.seed(holeTemp.id);
        if(temp === "s2") {
            setTimeout(randPlay, 500);
        }
        else {
            game.turn = PLAYER;
            turnBox.innerHTML = "Your turn";
        }

        game.updateEmptyHole(game, game.topRow, game.bottomRow, temp);

        if(terminate()) {
            decideWinner();
            return;
        }
        

        if(game.topRow.noSeeds() && game.turn === ADVERSARY && terminate(true)) {
            decideWinner();
            return;
        }

        
        return;
    }
} 

function pvpPlay(pit){
    let i = pit;

    let holeTemp = game.topRow.holes[i];
    let temp = game.seed(holeTemp.id);

    game.updateEmptyHole(game, game.topRow, game.bottomRow, temp);

    if(endGame && terminate()){
        decideWinner();
    }

    return;
}

function sleep(milliseconds) {
var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
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

    if(game.topRow.noSeeds()) {
        let newSeeds = 0;
        for(let i = 0; i < holeNumber; i++) {
            newSeeds += game.bottomRow.holes[i].removeSeed();
        }
        game.bottomRow.holes[holeNumber].addSeeds(newSeeds);
        return true;
    }

    if(game.bottomRow.noSeeds()) {
        let newSeeds = 0;
        for(let i = 0; i < holeNumber; i++) {
            newSeeds += game.topRow.holes[i].removeSeed();
        }

        game.topRow.holes[holeNumber].addSeeds(newSeeds);
        return true;
    }
        
    return false;
}

function update_local(){ 
    if(mode!==PVP){   
        rank.games++;
        localStorage.setItem('win', rank.win);
        localStorage.setItem('games', rank.games);
    }
}

function decideWinner(winner = null) {
    
    if(winner !== null) {
        // Check winner 
        if(winner === PLAYER){
            rank.win++;
            winnerText.innerHTML = "Player Won";
        }
        else{
            winnerText.innerHTML = "Adversary Won";
        }

        // Change Box contents
        let child = fixedUp.childNodes;
        for(let i = 0; i < child.length; i++) {
            if(child[i].id === "turnBox") {
                fixedUp.removeChild(child[i]);
                break;
            }
        }
        winnerBox.appendChild(winnerText);
        fixedUp.appendChild(winnerBox);
        playButton.innerHTML = "Limpar";
        update_local();

        // Change variavels
        game.turn = null;
        startGame=true;
        endGame=false;
        return;
    }

    // Check winner 
    let playerSeeds = game.bottomRow.holes[holeNumber].seedNumber;
    let adversarySeeds = game.topRow.holes[holeNumber].seedNumber;

    if(playerSeeds > adversarySeeds) {
        rank.win++;
        winnerText.innerHTML = "Player Won";
    } else if (playerSeeds === adversarySeeds) {
        winnerText.innerHTML = "Draw";
    } else {
        winnerText.innerHTML = "Adversary Won";
    }

    // Change Box contents
    let child = fixedUp.childNodes;
    for(let i = 0; i < child.length; i++) {
        if(child[i].id === "turnBox") {
            fixedUp.removeChild(child[i]);
            break;
        }
    }
    winnerBox.appendChild(winnerText);
    fixedUp.appendChild(winnerBox);
    playButton.innerHTML = "Limpar";

    update_local();
    // Change variables
    game.turn = null;
    startGame=true;
    endGame=false;
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

    fetch("http://twserver.alunos.dcc.fc.up.pt:9064/register",{
        method: 'POST',
        body: JSON.stringify(registar),
    })
    .then(function(response) {
        if(response.status===200) {
            nick=email;
            pass=password;
            login=true;
            alert("You´re Logged In!");
        } else if(response.status===401){
            alert("Email or Password dont record our match");
            console.log('Erro: ' + response.status + ": " +  response.statusText);  
         }
         else{
            console.log('Erro: ' + response.status + ": " +  response.statusText);
         }
     })
    .catch(console.log);
    

    // Just for playing porposes
    fetch("http://twserver.alunos.dcc.fc.up.pt:8008/register",{
        method: 'POST',
        body: JSON.stringify(registar),
    })
    .then(function(response) {
        if(response.ok) {
            nick=email;
            pass=password;
            login=true;
        } else{
            console.log('Erro: ' + response.status + ": " +  response.statusText);  
         }
     })
    .catch(console.log);
    
}


function join(grupo, email, password, cavidades, sementes){
    if(!login) alert("Please loggin first!");
    else{
        const juntar = {
            "group": grupo,
            "nick": email,
            "password": password,
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
            } 
            else{
                console.log('Erro: ' + response.status + ": " +  response.statusText);  
            }
        })
        .then(function(data){
            gameId=data.game;
            update(gameId, nick);
        })
        .catch(console.log);
    }
}

function leave(jogo, email, password){
    const desistir = {
        "game": jogo,
        "nick": email,
        "password": password
    }

    fetch("http://twserver.alunos.dcc.fc.up.pt:8008/leave",{
        method: 'POST',
        body: JSON.stringify(desistir),
    })
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } else{
           console.log('Erro: ' + response.status + ": " +  response.statusText);  
        }
    })
    .catch(console.log);
}

function notify(email, password, jogo, move){
    const notificar = {
        "nick": email,
        "password": password,
        "game": jogo,
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
           console.log('Erro: ' + response.status + ": " +  response.statusText);  
        }
     })
    .catch(console.log);
}

function update(jogo, email){
    eventSource = new EventSource("http://twserver.alunos.dcc.fc.up.pt:8008/update?nick=" + encodeURIComponent(email) + "&game=" + encodeURIComponent(jogo));
    eventSource.onmessage = function(event){
        const data = JSON.parse(event.data);
        
        if(data.hasOwnProperty("board")){
            if(startGame) {
                let k = Object.keys(data.board.sides);
                game = new Game();
                startGame=false;
            }
            
            if(game.turn===ADVERSARY){ 
                pvpPlay(data.pit);
            }

            if(data.board.turn===nick) {
                game.turn=PLAYER;
                turnBox.innerHTML="Your turn"
            }
            else{

                game.turn=ADVERSARY;
                turnBox.innerHTML="Adv turn"
            }

            

        }

        if(data.hasOwnProperty("winner")){
            if(data.winner==null && !data.hasOwnProperty("board")){
                 alert("Desistiu do jogo")
            }
            else{
                if(data.winner==nick){
                    winner=PLAYER;
                    update_rank(nick, true);
                }
                else{
                    winner=ADVERSARY;
                    update_rank(nick, false);
                }
                endGame = true;
                if(terminate() || endGame){
                    decideWinner(winner);
                    
                }
            }
        }
        
    }
}

function update_rank(email, win){
    const rank = {
        "nick": email,
        "win": win
    }

    fetch("http://twserver.alunos.dcc.fc.up.pt:9064/updaterank",{
        method: 'POST',
        body: JSON.stringify(rank),
    })
    .then(function(response) {
        if(response.status===200) {
            console.log("Update feito");
        } else{
           console.log('erro: ' + response.status + ": " +  response.statusText);  
        }
     })
    .catch(console.log);

}
