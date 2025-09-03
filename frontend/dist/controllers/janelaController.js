import JanelaView from "../views/janelaView.js";
class JanelaController {
    constructor() {
        this.janelaView = new JanelaView();
        this.adicionaEventosDeClick();
    }
    adicionaEventosDeClick() {
        this.abasSelecionaveis = document.querySelectorAll(".abaSelecionavel");
        for (let i = 0; i <= this.abasSelecionaveis.length - 1; i++) {
            if (!this.abasSelecionaveis[i].classList.contains("hasEvent")) {
                this.abasSelecionaveis[i].classList.add("hasEvent");
                this.abasSelecionaveis[i].addEventListener("click", (event) => {
                    event.stopPropagation();
                    var abaClicada = event.currentTarget;
                    this.janelaView.selecionaAba(abaClicada);
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
