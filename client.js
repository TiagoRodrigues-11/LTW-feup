let nick;
let pass;
const group = 64;
let gameId;
let eventSource;

let login=false;

/*Variáveis globais para o gameologics */

let loginForm = document.getElementById("login");
let createAccountForm = document.getElementById("createAccount");
let Register = document.getElementById("Register");
let Login = document.getElementById("Login");

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
     .then(function(data){
         console.log("notify");
         console.log(data);
     })
    .catch(console.log);
}

function update(){
    eventSource = new EventSource("http://twserver.alunos.dcc.fc.up.pt:8008/update?nick=" + encodeURIComponent(nick) + "&game=" + encodeURIComponent(gameId));
    eventSource.onmessage = function(event){
        const data = JSON.parse(event.data);
        console.log(data);
        if(data.hasOwnProperty("winner")){
            console.log("Jogo Termina");
        }
        else{
            const turn = data.board.turn;
            if(turn===nick) {
                console.log("Your turn!");
            }
        }
        
    }
    return true;
}
