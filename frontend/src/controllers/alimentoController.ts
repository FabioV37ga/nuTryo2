import AlimentoView from "../views/alimentoView.js"

class AlimentoController {
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
            this.botaoAdicionarAlimento.addEventListener("click", () => {
                this.alimentoView.adicionarAlimento()
                this.botaoEditarAlimento = document.querySelectorAll(".botao-editar-alimento")
                this.botaoApagarAlimento = document.querySelectorAll(".botao-apagar-alimento") as NodeListOf<Element>
                this.adicionarEventosDeClick()
            })
        }

        // # Adiciona função para editar e apagar alimentos
        for (let i = 0; i <= this.botaoEditarAlimento.length - 1; i++) {

            // Previne adição multipla de eventos de click
            if (!this.botaoEditarAlimento[i].classList.contains("hasEvent")) {
                this.botaoEditarAlimento[i].classList.add("hasEvent")

                // Adiciona evento de click
                this.botaoEditarAlimento[i].addEventListener("click", (e) => {
                    e.stopPropagation
                    console.log(e.currentTarget)
                })
            }

            // Previne adição multipla de eventos de click
            if (!this.botaoApagarAlimento[i].classList.contains("hasEvent")) {
                this.botaoApagarAlimento[i].classList.add("hasEvent")

                // Adiciona evento de click
                this.botaoApagarAlimento[i].addEventListener("click", (e) => {
                    e.stopPropagation
                    var elementoClicado = e.currentTarget as Element
                    this.alimentoView.apagarAlimento(elementoClicado.parentElement as Element)
                })
            }
        }


    }
}

export default AlimentoController