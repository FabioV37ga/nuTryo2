import AlimentoView from "../views/alimentoView.js";
class AlimentoController {
    constructor() {
        this.alimentoView = new AlimentoView();
        this.botaoAdicionarAlimento = document.querySelector(".botao-adicionar-alimento");
        this.botaoEditarAlimento = document.querySelectorAll(".botao-editar-alimento");
        this.botaoApagarAlimento = document.querySelectorAll(".botao-apagar-alimento");
        this.adicionarEventosDeClick();
    }
    adicionarEventosDeClick() {
        if (!this.botaoAdicionarAlimento.classList.contains("hasEvent")) {
            this.botaoAdicionarAlimento.classList.add("hasEvent");
            this.botaoAdicionarAlimento.addEventListener("click", () => {
                this.alimentoView.adicionarAlimento();
                this.botaoEditarAlimento = document.querySelectorAll(".botao-editar-alimento");
                this.botaoApagarAlimento = document.querySelectorAll(".botao-apagar-alimento");
                this.adicionarEventosDeClick();
            });
        }
        for (let i = 0; i <= this.botaoEditarAlimento.length - 1; i++) {
            if (!this.botaoEditarAlimento[i].classList.contains("hasEvent")) {
                this.botaoEditarAlimento[i].classList.add("hasEvent");
                this.botaoEditarAlimento[i].addEventListener("click", (e) => {
                    e.stopPropagation;
                    console.log(e.currentTarget);
                });
            }
            if (!this.botaoApagarAlimento[i].classList.contains("hasEvent")) {
                this.botaoApagarAlimento[i].classList.add("hasEvent");
                this.botaoApagarAlimento[i].addEventListener("click", (e) => {
                    e.stopPropagation;
                    var elementoClicado = e.currentTarget;
                    this.alimentoView.apagarAlimento(elementoClicado.parentElement);
                });
            }
        }
    }
}
export default AlimentoController;
