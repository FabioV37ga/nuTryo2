declare var $: any;

import JanelaView from "./janelaView.js";

class RefeicoesView extends JanelaView {
    private static _id: number = 1
    id: number
    constructor() {
        super()
    }

    adicionarRefeicao() {

        this.id = RefeicoesView._id
        RefeicoesView._id += 1

        const elemento =
            `<div class="refeicao" value="${this.id}">
            <a class="botao-editar-refeicao">
                <i class="fa fa-pencil" aria-hidden="true"></i>
            </a>
            <span class="refeicao-list-label">
            </span>
            <div class="botao-apagar-refeicao">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </div>
        </div>`

        $(".lista-de-refeicoes").append(elemento)
    }

    removerRefeicao(refeicao: Element) {
        refeicao.remove()
    }
    log() {
        console.log("Aves!")
    }
}

export default RefeicoesView;