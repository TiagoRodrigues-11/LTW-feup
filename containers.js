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
let conta = document.getElementById("container");

conSlider.oninput = function() {
    
    let numCon = conSlider.value;
    while(conta.firstChild) {
        conta.removeChild(conta.firstChild);
    }

    for(let i = 0; i < numCon; i++){
        let container = document.createElement("div");
        container.classList.add("container");
        conta.appendChild(container);
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
