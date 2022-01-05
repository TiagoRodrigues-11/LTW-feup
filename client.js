let nick;
let pass;
const group = 64;
let gameId;
let evento

let loginForm = document.getElementById("login");
let createAccountForm = document.getElementById("createAccount");
let Register = document.getElementById("Register")

function setFormMessage(formElement, type, message){
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form __message--success" , "form__message--error");
    messageElement.classList.add('form__message--${type}');
}


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
    let Email = document.getElementById("createEmail");
    let Pass = document.getElementById("createPass");
    const createEmail = Email.value;
    const createPass = Pass.value;

    modal[0].style.display = "none";

    register(createEmail, createPass);
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
            console.log(nick + " " + pass);
        } else{
            console.log('erro: ' + response.status + ": " +  response.statusText);  
         }
     })
    .catch(console.log);
    
}

let score = document.getElementById("scoreBtn");

score.onclick = ranking;

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

/*
playButton.onclick = function() {
    /*if(game!== null){
        console.log("novo");
    }

    if(modeTemp===PVP){
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

        join();
        /*mode = modeTemp;
        game = new Game();
        console.log(game);
        console.log(mode);
        playButton.innerHTML = "Desistir";+
    }

}*/


function join(){
    const juntar = {
        "group": group,
        "nick": nick,
        "password": pass,
        "size": holeNumber,
        "initial": seedNumber
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
     })
    .catch(console.log);
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
         
     })
    .catch(console.log);
}

function notify(){
    const notificar = {
        "nick": nick,
        "password": pass,
        "game": gameId,
        "move": 1
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
     .then(function(data){
         
     })
    .catch(console.log);
}

function update(){
    evento = new EventSource("http://twserver.alunos.dcc.fc.up.pt:8008/update?nick=" + nick + "&game=" + gameId);
}