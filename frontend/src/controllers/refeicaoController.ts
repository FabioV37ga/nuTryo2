import RefeicaoView from "../views/refeicaoView.js";

class RefeicaoController {
    private refeicaoView = new RefeicaoView()
    listaTipoLabel: Element;
    listaTipos: Element;
    listaTiposItem: NodeListOf<Element>;
    constructor() {
        this.listaTipoLabel = document.querySelector(".refeicao-tipo-tipoSelecionado") as Element;
        this.listaTipos = document.querySelector(".refeicao-tipo-list") as Element;
        this.listaTiposItem = document.querySelectorAll(".refeicao-tipo-list li") as NodeListOf<Element>;
        this.adicionaEventosDeClick()
    }

    private adicionaEventosDeClick() {

        // Abre a lista ao clicar no tipo selecionado
        // Previne adição multipla de eventos de click
        if (!this.listaTipoLabel.classList.contains("hasEvent")) {
            this.listaTipoLabel.classList.add("hasEvent")

            // Adiciona evento
            this.listaTipoLabel.addEventListener("click", (e) => {
                e.stopPropagation
                // Esconde/ mostra lista
                this.refeicaoView.toggleListaDeTipos()
            })
        }

        // Seleciona o tipo, e fecha a lista de tipos
        for (let i = 0; i <= this.listaTiposItem.length - 1; i++) {
            // Previne adição multipla de eventos de click
            if (!this.listaTiposItem[i].classList.contains("hasEvent")) {
                this.listaTiposItem[i].classList.add("hasEvent")

                this.listaTiposItem[i].addEventListener("click", (e) => {
                    e.stopPropagation
                    this.refeicaoView.selecionaItem(e.currentTarget as HTMLElement)
                    this.refeicaoView.toggleListaDeTipos()
                })

            }
        }
    }

}

export default RefeicaoController