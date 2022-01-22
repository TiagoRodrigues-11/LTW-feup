/*
    Este ficheiro vai ser responsavel pelos modals
*/

// Get the modal

const modal = [
    document.getElementById("loginModal"),
    document.getElementById("rulesModal"),
    document.getElementById("scoreModal"),
    document.getElementById("settingsModal")
    
];
// Get the button that opens the modal

const btn = [
    document.getElementById("loginBtn"),
    document.getElementById("rulesBtn"),
    document.getElementById("scoreBtn"),
    document.getElementById("settingsBtn")
];

// Get the <span> element that closes the modal

const span = [
    document.getElementsByClassName("close")[0],
    document.getElementsByClassName("close")[1],
    document.getElementsByClassName("close")[2],
    document.getElementsByClassName("close")[3]
];

// When the user clicks on the button, open the modal
for(let i = 0; i < btn.length; i++){
    btn[i].onclick = function() {
        
        modal[i].style.display = "block";
        if(i === 2) {
            
            ranking();
        
            if(typeof(Storage) !== "undefined"){
                if(localStorage.getItem('win') && localStorage.getItem('games')){
                    rank['win'] = localStorage.getItem('win');
                    rank['games'] = localStorage.getItem('games');
                }
                table(rank);
            }
            else{
                console.log("Não há webstorage");
            }
            
        }
    }
}

// When the user clicks on <span> (x), close the modal

for(let i = 0; i < span.length; i++) {
    span[i].onclick = function() {
        modal[i].style.display = "none";
        if(i===2) {
            removeTables();
        }

    }
}


// When the user clicks anywhere outside of the modal, close it

window.onclick = function(event) {
    for(let i = 0; i < modal.length; i++) {
        if (event.target == modal[i]) {
            modal[i].style.display = "none";
            if(i===2) {
                removeTables();
            }
        }
    }
}


function removeTables() {
    let scoreTableT = document.getElementById("scoreTable");
    let childs = Array.from(scoreTableT.childNodes);

    childs.forEach(function(child) {
        if(child.id === "tableScoreLocal" || child.id === "tableScoreRemote") {
            scoreTableT.removeChild(child);
        }
    });
}

function table(rank){
    let tbl = document.createElement('table');
    tbl.id = "tableScoreLocal";
    tbl.style.marginBottom = "25px";
    let tr = document.createElement('tr');

    // For first Row
    let th1 = document.createElement('th');
    th1.appendChild(document.createTextNode("Nick"));

    let th2 = document.createElement('th');
    th2.appendChild(document.createTextNode("Victories"));

    let th3 = document.createElement('th');
    th3.appendChild(document.createTextNode("Games"));

    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);

    tbl.appendChild(tr);

    let tr1 = document.createElement('tr');

    for(let j = 0; j < 3; j++) {
        let td = document.createElement('td');

        switch(j) {
            case 0:
                td.appendChild(document.createTextNode(rank.nick));
                break;

            case 1:
                td.appendChild(document.createTextNode(rank.win));
                break;
            
            case 2:
                td.appendChild(document.createTextNode(rank.games));
                break;
        }
        
        tr1.appendChild(td);
    }

    tbl.appendChild(tr1);
    document.getElementById("scoreTable").appendChild(tbl);
}


function ranking(){
    fetch(new URL("http://twserver.alunos.dcc.fc.up.pt:9064/ranking"), {
        method: "POST",
        body: JSON.stringify({})
    })
    .then(function(response){
        if(response.status===200) {
            return response.json();
        } else{
           console.log('Erro: ' + response.status + ": " +  response.statusText);  
        }
    })
    .then(function(data){

        let tbl = document.createElement('table');
        tbl.id = "tableScoreRemote";
        let tr = document.createElement('tr');

        // For first Row
        let th1 = document.createElement('th');
        th1.appendChild(document.createTextNode("Nick"));

        let th2 = document.createElement('th');
        th2.appendChild(document.createTextNode("Wins"));

        let th3 = document.createElement('th');
        th3.appendChild(document.createTextNode("Games"));

        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);

        tbl.appendChild(tr);

        for(let i = 0; i < data.length; i++) {
            let tr = document.createElement('tr');

            for(let j = 0; j < 3; j++) {
                let td = document.createElement('td');

                switch(j) {
                    case 0:
                        td.appendChild(document.createTextNode(data[i].nick));
                        break;

                    case 1:
                        td.appendChild(document.createTextNode(data[i].win));
                        break;
                    
                    case 2:
                        td.appendChild(document.createTextNode(data[i].game));
                        break;
                }
                
                tr.appendChild(td);
            }

            tbl.appendChild(tr);
        }

        document.getElementById("scoreTable").appendChild(tbl);
    });
}
