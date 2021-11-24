/*
    Este ficheiro vai ser responsavel pelos modals

*/

// Get the modal

const modal = [
    document.getElementById("loginModal"),
    document.getElementById("rulesModal"),
    document.getElementById("scoreModal"),
    document.getElementById("settingsModal"),
    document.getElementById("controllersModal")
];
// Get the button that opens the modal

const btn = [
    document.getElementById("loginBtn"),
    document.getElementById("rulesBtn"),
    document.getElementById("scoreBtn"),
    document.getElementById("settingsBtn"),
    document.getElementById("controllersBtn")
];

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
for(let i = 0; i < btn.length; i++){
    btn[i].onclick = function() {
        modal[i].style.display = "block";
    }
}

// When the user clicks on <span> (x), close the modal
for(let i = 0; i < modal.length; i++) {
    span.onclick = function() {
        modal[i].style.display = "none";
    }
}

// When the user clicks anywhere outside of the modal, close it
for(let i = 0; i < modal.length; i++) {
    window.onclick = function(event) {
        if (event.target == modal[i]) {
            modal[i].style.display = "none";
        }
    }
}