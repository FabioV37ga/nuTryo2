import JanelaView from "../views/janelaView.js";
import AlimentoController from "./alimentoController.js";
class JanelaController {
    constructor() {
        this.janelaView = new JanelaView();
        this.adicionaEventosDeClick();
        JanelaController.controller = this;
    }
    adicionaEventosDeClick() {
        var abaData = document.querySelector("#data-display");
        if (!(abaData === null || abaData === void 0 ? void 0 : abaData.classList.contains("hasEvent"))) {
            abaData.classList.add("hasEvent");
            abaData.addEventListener("click", () => {
                if (window.innerWidth <= 985)
                    this.janelaView.esconderJanela();
            });
        }
        this.abasSelecionaveis = document.querySelectorAll(".abaSelecionavel");
        for (let i = 0; i <= this.abasSelecionaveis.length - 1; i++) {
            if (!this.abasSelecionaveis[i].classList.contains("hasEvent")) {
                this.abasSelecionaveis[i].classList.add("hasEvent");
                this.abasSelecionaveis[i].addEventListener("click", (event) => {
                    event.stopPropagation();
                    var abaClicada = event.currentTarget;
                    this.janelaView.selecionaAba(abaClicada);
                    var alimentoController = new AlimentoController();
                    alimentoController.adicionaEventosDeClick();
                });
            }
        }
        this.closeRefeicao = document.querySelectorAll(".refeicao-fechar");
        for (let i = 0; i <= this.closeRefeicao.length - 1; i++) {
            if (!this.closeRefeicao[i].classList.contains("hasEvent")) {
                this.closeRefeicao[i].classList.add("hasEvent");
                this.closeRefeicao[i].addEventListener("click", (e) => {
                    e.stopPropagation();
                    var abaClicada = e.currentTarget;
                    abaClicada = abaClicada.parentElement;
                    if (abaClicada.classList.contains("abaSelecionada")) {
                        this.janelaView.selecionaAba(this.abasSelecionaveis[0]);
                    }
                    this.janelaView.apagaAba(abaClicada);
                });
            }
        }
    }
}
export default JanelaController;
