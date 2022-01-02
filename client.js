let nick;
let pass;

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

    console.log (createEmail);
    console.log(createPass);
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
           response.text().then(console.log);
        } else
           console.log('erro: ' + response.statusText);
     })
    .catch(console.log);
    
}
