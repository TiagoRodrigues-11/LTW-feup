/*
    Este ficheiro vai ser responsavel por mudar o numero de containers e coloca-los na posição
        correta. 
*/

/*class armazem{

}*/
class tabuleiro{
    constructor(containerId, sementes){
        this.seeds=sementes;
        this.elemento = document.getElementById(containerId);
    }

    /*Acho que aqui esta um problema */
    semear(){
        for(let i=0; i < this.seeds; i++){
            let semente = document.createElement("div");
            semente.classList.add("seed");
            semente.style.top = (15+Math.random(100) * 50) + "%";
            semente.style.left = (15+Math.random(100) * 50) + "%";
            let valueRan = "rotate(" + Math.round(Math.random(1) * 180) + "deg)"
            semente.style.transform = valueRan;
            this.elemento.appendChild(semente);
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

    // Remover todas os elementos dentro do containers Up e Down
    while(contaParentUp.firstChild) {
        contaParentUp.removeChild(contaParentUp.firstChild);
    }
    while(contaParentDown.firstChild) {
        contaParentDown.removeChild(contaParentDown.firstChild);
    }

    let ind1 = 1;
    let ind2 = numCon;

    for(let i = 0; i < numCon; i++){
        let container1 = document.createElement("div");
        let container2 = document.createElement("div");

        container1.id="c"+ind1;
        ind1++;
        container2.id="c"+ind2;
        ind2++;

        container1.classList.add("container");
        container2.classList.add("container");

        contaParentUp.appendChild(container1);
        contaParentDown.appendChild(container2);

        containerUp[i] = new tabuleiro(container1.id, seeds);
        containerDown[i] = new tabuleiro(container2.id, seeds);

    }


    for(let j = 0; j < numCon; j++){
        /*Não consigo criar as sementes */
        containerUp[j].semear();
        containerDown[j].semear();
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
