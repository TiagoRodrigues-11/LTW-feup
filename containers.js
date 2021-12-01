/*
    Este ficheiro vai ser responsavel por mudar o numero de containers e coloca-los na posição
        correta. 
*/

/*
Acho que sei o que tenho que fazer
Introduzir os pais e depois os filhos....
Assim sucessivamente
Deve funcionar
*/
let conSlider = document.getElementById("containerSlider");
let contaParentUp = document.getElementById("containersParentUp");
let contaParentDown = document.getElementById("containersParentDown")

conSlider.oninput = function() {
    
    let numCon = conSlider.value;

    while(contaParentUp.firstChild) {
        contaParentUp.removeChild(contaParentUp.firstChild);
    }
    while(contaParentDown.firstChild) {
        contaParentDown.removeChild(contaParentDown.firstChild);
    }

    for(let i = 0; i < numCon; i++){
        let container1 = document.createElement("div");
        let container2 = document.createElement("div");
        container1.classList.add("container");
        container2.classList.add("container");
        contaParentUp.appendChild(container1);
        contaParentDown.appendChild(container2);
    }
}



// TESTAR ESTA FUNÇAO 
// Perguntar à como inicializar com um certo numero
function containersload() {
    console.log("load");
    let conSlider = document.getElementById("containerSlider"); 

    conSlider.onload = function() {
        let numCon = conSlider.value;
        console.log("load");
        for(let i = 0; i < numCon; i++){
            let container = document.createElement("div");
            container.classList.add("container");
            conta.appendChild(container);
        }
    }
}
