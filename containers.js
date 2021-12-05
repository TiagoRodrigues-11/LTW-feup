/*
    Este ficheiro vai ser responsavel por mudar o numero de containers e coloca-los na posição
        correta. 
*/

/*class armazem{

}*/

class tabuleiro{
    constructor(containerId, sementes){
        this.seeds=sementes;
        //this.containerId = containerId;
        this.elemento = document.getElementById("containerId")
    }

    /*Acho que aqui esta um problema */
    semear(){
        for(let i=0; i<this.seeds; i++){
            let semente = document.createElement("div");
            semente.classList.add("seed");
            elemento.appendChild(semente);
        }
    }
    
}

let conSlider = document.getElementById("containerSlider");
let contaParentUp = document.getElementById("containersParentUp");
let contaParentDown = document.getElementById("containersParentDown")
let jogar = document.getElementById("jogar")
let semente = document.getElementById("semente");

const seeds = semente.value;
const containerUp = new Array(conSlider.value);
const containerDown = new Array(conSlider.value);

jogar.onclick = function() {
    jogar.addEventListener("click",start,false);
    let numCon = conSlider.value;

    while(contaParentUp.firstChild) {
        contaParentUp.removeChild(contaParentUp.firstChild);
    }
    while(contaParentDown.firstChild) {
        contaParentDown.removeChild(contaParentDown.firstChild);
    }

    let ind = 1;

    for(let i = 0; i < numCon; i++){
        let container1 = document.createElement("div");
        let container2 = document.createElement("div");
        container1.id="c"+ind;
        ind++;
        container2.id="c"+ind;
        ind++;
        container1.classList.add("container");
        container2.classList.add("container");
        containerUp[i] = new tabuleiro(container1.id, seeds);
        containerDown[i] = new tabuleiro(container2.id, seeds);
        contaParentUp.appendChild(container1);
        contaParentDown.appendChild(container2);
    }

    for(let j = 0; j < numCon; j++){
        /*Não consigo criar as sementes */
        containerUp[j].semear();
    }

    function start(){
        this.style.opacity = "0";
        this.style.zIndex = "-1";
        this.removeEventListener("click",start, false);
    }
}
/*Se houver click as semestes vão semear para a frente e se chegar ao 
    último então troca de container
 */

/*
Ter uma função que verifica se containerUp ou containerDown está vazia
Se uma dessas estiver então o jogo termina e vêmos as sementes que estão no armazem
*/




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
