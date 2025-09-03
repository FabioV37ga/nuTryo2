import RefeicoesView from "../views/refeicoesView.js";
import JanelaController from "./janelaController.js";
class RefeicoesController extends JanelaController {
    constructor() {
        super();
        this.RefeicoesView = new RefeicoesView();
        this.adicionaEventosDeClick();
    }
    adicionaEventosDeClick() {
        this.itemRefeicao = document.querySelectorAll(".refeicao");
        for (let i = 1; i <= this.itemRefeicao.length - 1; i++) {
            if (!this.itemRefeicao[i].classList.contains("hasEvent")) {
                this.itemRefeicao[i].classList.add("hasEvent");
                this.itemRefeicao[i].children[0].addEventListener("click", (e) => {
                    var titulo = this.itemRefeicao[i].textContent.toString().trim().split(" ")[0];
                    var id = Number(this.itemRefeicao[i].getAttribute("value"));
                    var abaCriada = this.RefeicoesView.criaAba(titulo, id);
                    this.RefeicoesView.selecionaAba(abaCriada);
                    this.adicionaEventosDeClick();
                    super.adicionaEventosDeClick();
                });
                this.itemRefeicao[i].children[2].addEventListener("click", (e) => {
                    var item = e.currentTarget;
                    this.RefeicoesView.removerRefeicao(item.parentElement);
                });
            }
        }
    }
}
export default RefeicoesController;
