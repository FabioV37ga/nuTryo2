import DiaView from "../views/diaView.js";
import JanelaController from "./janelaController.js";
class DiaController extends JanelaController {
    constructor() {
        super();
        this.diaView = new DiaView();
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
                    var abaCriada = this.diaView.criaAba(titulo, id);
                    this.diaView.selecionaAba(abaCriada);
                    this.adicionaEventosDeClick();
                    super.adicionaEventosDeClick();
                });
            }
        }
    }
}
export default DiaController;
