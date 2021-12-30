function setFormMessage(formElement, type, message){
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form __message--success" , "form__message--error");
    messageElement.classList.add('form__message--${type}');
}


document.addEventListener("DOMContentLoaded", ()=>{
    const loginForm = document.getElementById("login");
    const createAccountForm = document.getElementById("createAccount");

    document.getElementById("linkCreateAccount").addEventListener("click", ()=>{
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.getElementById("linkLogin").addEventListener("click", ()=>{
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    //loginForm.addEventListener("submit", );

    const createEmail = document.getElementById("createEmail").value;
    const createPass = document.getElementById("createPass").value;
    console.log (createEmail);
    console.log(createPass);
    createAccountForm.addEventListener("submit", register(createEmail,createPass));

});

function register(email, pass){

    const registar = {
        "nick": email,
        "password": pass
    }

    webSocket.send(JSON.stringify(registar));
}