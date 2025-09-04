import JanelaView from "./janelaView.js";
class RefeicoesView extends JanelaView {
    constructor() {
        super();
    }
    adicionarRefeicao() {
        this.id = RefeicoesView._id;
        RefeicoesView._id += 1;
        const elemento = `<div class="refeicao" value="${this.id}">
            <a class="botao-editar-refeicao">
                <i class="fa fa-pencil" aria-hidden="true"></i>
            </a>
            <span class="refeicao-list-label">Café da Manhã • Alimento1 • Alimento2 • Alimento3 • Alimento4
                •...
            </span>
            <div class="botao-apagar-refeicao">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </div>
        </div>`;
        $(".lista-de-refeicoes").append(elemento);
    }
    removerRefeicao(refeicao) {
        refeicao.remove();
    }
    log() {
        console.log("Aves!");
    }
}
RefeicoesView._id = 1;
export default RefeicoesView;
