import AlimentoView from "../views/alimentoView.js"
import {frontend} from "../utils/connection.js";

class AlimentoController {
    static AlimentoControllerSearchDelay = 800;
    static AlimentoControllerSearchInterval:any
    alimentoView = new AlimentoView()
    botaoAdicionarAlimento: Element
    botaoEditarAlimento: NodeListOf<Element>
    botaoApagarAlimento: NodeListOf<Element>

    constructor() {
        this.botaoAdicionarAlimento = document.querySelector(".botao-adicionar-alimento") as Element;
        this.botaoEditarAlimento = document.querySelectorAll(".botao-editar-alimento") as NodeListOf<Element>
        this.botaoApagarAlimento = document.querySelectorAll(".botao-apagar-alimento") as NodeListOf<Element>
        this.adicionarEventosDeClick();
    }

    private adicionarEventosDeClick() {

        // # Adiciona função para adicionar novos alimentos
        // Previne adição multipla de eventos de click
        if (!this.botaoAdicionarAlimento.classList.contains("hasEvent")) {
            this.botaoAdicionarAlimento.classList.add("hasEvent")
            
            // Adiciona evento de click
            this.botaoAdicionarAlimento.addEventListener("click", (e) => {
                e.stopPropagation
            
                // Adiciona alimento
                this.alimentoView.adicionarAlimento()

                // Adiciona elementos criados nos atributos
                this.botaoEditarAlimento = document.querySelectorAll(".botao-editar-alimento")
                this.botaoApagarAlimento = document.querySelectorAll(".botao-apagar-alimento") as NodeListOf<Element>

                // Adiciona função de click aos elementos criados
                this.adicionarEventosDeClick()
            })
        }

        // # Adiciona função para editar e apagar alimentos
        for (let i = 0; i <= this.botaoEditarAlimento.length - 1; i++) {

            // Edição de alimentos
            // Previne adição multipla de eventos de click
            if (!this.botaoEditarAlimento[i].classList.contains("hasEvent")) {
                this.botaoEditarAlimento[i].classList.add("hasEvent")

                // Adiciona evento de click
                this.botaoEditarAlimento[i].addEventListener("click", (e) => {
                    e.stopPropagation

                    // Abre a janela de edição referente ao alimento clicado
                    var elementoClicado = e.currentTarget as Element
                    this.alimentoView.toggleJanelaDeEdicao(elementoClicado.parentElement?.children[3] as Element)
                })
            }

            // Remoção de alimentos
            // Previne adição multipla de eventos de click
            if (!this.botaoApagarAlimento[i].classList.contains("hasEvent")) {
                this.botaoApagarAlimento[i].classList.add("hasEvent")

                // Adiciona evento de click
                this.botaoApagarAlimento[i].addEventListener("click", (e) => {
                    e.stopPropagation

                    // Apaga alimento
                    var elementoClicado = e.currentTarget as Element
                    this.alimentoView.apagarAlimento(elementoClicado.parentElement as Element)
                })
            }

            var campoPesquisa = document.querySelector("#selecao-valor-texto") as HTMLElement

            if (!campoPesquisa.classList.contains("hasSearchEvent")){
                campoPesquisa.classList.add("hasSearchEvent")

                campoPesquisa.addEventListener("input", ()=>{
                    this.pesquisaComDelay()
                })
            }
        }
    }

    private pesquisaComDelay(){
        AlimentoController.AlimentoControllerSearchDelay = 800
        clearInterval(AlimentoController.AlimentoControllerSearchInterval)
        AlimentoController.AlimentoControllerSearchInterval = setInterval(() => {
            console.log("Toc")
            this.pesquisa()
            clearInterval(AlimentoController.AlimentoControllerSearchInterval)
        }, AlimentoController.AlimentoControllerSearchDelay);

    }

    private async pesquisa(){
        const campoPesquisa:HTMLFormElement = document.querySelector("#selecao-valor-texto") as HTMLFormElement
        const alimentoPesquisado = campoPesquisa.value
        alimentoPesquisado.trim().replaceAll(" ", "%20")

        const resposta = await fetch(`${frontend}/alimentos/buscar?nome=${alimentoPesquisado}`, {
            method: "GET",
            headers:{
                "Content-Type": "Application/json"
            }
        })
        const dados = await resposta.json()
        if (dados){
            console.log(dados)
        }
    }
}

export default AlimentoController