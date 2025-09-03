import JanelaView from "../views/janelaView.js";
class JanelaController {
    constructor() {
        this.janelaView = new JanelaView();
        this.adicionaEventosDeClick();
    }
    adicionaEventosDeClick() {
        this.itemRefeicao = document.querySelectorAll(".refeicao");
        for (let i = 1; i <= this.itemRefeicao.length - 1; i++) {
            if (!this.itemRefeicao[i].classList.contains("hasEvent")) {
                this.itemRefeicao[i].classList.add("hasEvent");
                this.itemRefeicao[i].children[0].addEventListener("click", () => {
                    var titulo = this.itemRefeicao[i].textContent.toString().trim().split(" ")[0];
                    var id = Number(this.itemRefeicao[i].getAttribute("value"));
                    console.log(id);
                    this.janelaView.criaAba(titulo, id);
                    this.janelaView.selecionaAba(id);
                    this.adicionaEventosDeClick();
                });
            }
        }
        this.abas = document.querySelectorAll(".abaSelecionavel");
        for (let i = 0; i <= this.abas.length - 1; i++) {
            if (!this.abas[i].classList.contains("hasEvent")) {
                this.abas[i].classList.add("hasEvent");
                this.abas[i].addEventListener("click", (event) => {
                    event.stopPropagation();
                    var id = Number(this.abas[i].getAttribute("value"));
                    console.log(id);
                    this.janelaView.selecionaAba(id);
                });
            }
        }
        this.closeRefeicao = document.querySelectorAll(".refeicao-fechar");
        for (let i = 0; i <= this.closeRefeicao.length - 1; i++) {
            if (!this.closeRefeicao[i].classList.contains("hasEvent")) {
                this.closeRefeicao[i].classList.add("hasEvent");
                this.closeRefeicao[i].addEventListener("click", (e) => {
                    var _a;
                    e.stopPropagation();
                    (_a = this.closeRefeicao[i].parentElement) === null || _a === void 0 ? void 0 : _a.remove();
                    this.janelaView.selecionaAba(0);
                });
            }
        }
    }
}
export default JanelaController;
