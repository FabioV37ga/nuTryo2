import RefeicaoView from "../views/refeicaoView.js";
class RefeicaoController {
    constructor() {
        this.refeicaoView = new RefeicaoView();
        this.listaTipoLabel = document.querySelector(".refeicao-tipo-tipoSelecionado");
        this.listaTipos = document.querySelector(".refeicao-tipo-list");
        this.listaTiposItem = document.querySelectorAll(".refeicao-tipo-list li");
        this.adicionaEventosDeClick();
    }
    adicionaEventosDeClick() {
        if (!this.listaTipoLabel.classList.contains("hasEvent")) {
            this.listaTipoLabel.classList.add("hasEvent");
            this.listaTipoLabel.addEventListener("click", (e) => {
                e.stopPropagation;
                this.refeicaoView.toggleListaDeTipos();
            });
        }
        for (let i = 0; i <= this.listaTiposItem.length - 1; i++) {
            if (!this.listaTiposItem[i].classList.contains("hasEvent")) {
                this.listaTiposItem[i].classList.add("hasEvent");
                this.listaTiposItem[i].addEventListener("click", (e) => {
                    e.stopPropagation;
                    this.refeicaoView.selecionaItem(e.currentTarget);
                    this.refeicaoView.toggleListaDeTipos();
                });
            }
        }
    }
}
export default RefeicaoController;
