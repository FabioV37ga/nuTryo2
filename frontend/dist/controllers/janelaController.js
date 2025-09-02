import JanelaView from "../views/janelaView.js";
class JanelaController {
    constructor() {
        this.janelaView = new JanelaView();
        this.adicionaEventosDeClick();
    }
    adicionaEventosDeClick() {
        this.abas = document.querySelectorAll(".aba");
        for (let i = 1; i <= this.abas.length - 1; i++) {
            this.abas[i].addEventListener("click", () => { this.janelaView.selecionaAba(i); });
        }
    }
}
export default JanelaController;
