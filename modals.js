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
        }
    }
}

// When the user clicks on <span> (x), close the modal

for(let i = 0; i < span.length; i++) {
    span[i].onclick = function() {
        modal[i].style.display = "none";
        let temp = document.getElementById("scoreTable").childNodes;
        for(let i = 0; i < temp.length; i++) {
            if(temp[i].id ==="tableScore") {
                document.getElementById("scoreTable").removeChild(temp[i]);
            }
        }

    }
}


// When the user clicks anywhere outside of the modal, close it

window.onclick = function(event) {
    for(let i = 0; i < modal.length; i++) {
        if (event.target == modal[i]) {
            modal[i].style.display = "none";
            let temp = document.getElementById("scoreTable").childNodes;
            for(let i = 0; i < temp.length; i++) {
                if(temp[i].id ==="tableScore") {
                    document.getElementById("scoreTable").removeChild(temp[i]);
                }
            }
        }
    }
}


function ranking(){
    fetch("http://twserver.alunos.dcc.fc.up.pt:9064/ranking", {
        method: "POST",
        body: JSON.stringify({})
    })
    .then(function(response){
        if(response.ok) {
            return response.json();
        } else{
           console.log('Erro: ' + response.status + ": " +  response.statusText);  
        }
    })
    .then(function(data){
        
        let tbl = document.createElement('table');
        tbl.id = "tableScore";
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

        for(let i = 0; i < data.ranking.length; i++) {
            let tr = document.createElement('tr');

            for(let j = 0; j < 3; j++) {
                let td = document.createElement('td');

                switch(j) {
                    case 0:
                        td.appendChild(document.createTextNode(data.ranking[i].nick));
                        break;

                    case 1:
                        td.appendChild(document.createTextNode(data.ranking[i].victories));
                        break;
                    
                    case 2:
                        td.appendChild(document.createTextNode(data.ranking[i].games));
                        break;
                }
                
                tr.appendChild(td);
            }

            tbl.appendChild(tr);
        }

        document.getElementById("scoreTable").appendChild(tbl);
    })
}
