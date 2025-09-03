import JanelaView from "./janelaView.js";
class RefeicoesView extends JanelaView {
    constructor() {
        super();
    }
    removerRefeicao(refeicao) {
        refeicao.remove();
    }
}
export default RefeicoesView;
