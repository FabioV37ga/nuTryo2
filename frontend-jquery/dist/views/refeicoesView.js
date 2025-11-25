import JanelaView from "./janelaView.js";
class RefeicoesView extends JanelaView {
    constructor() {
        super();
    }
    adicionarRefeicao(refeicao) {
        this.id = RefeicoesView._id;
        RefeicoesView._id += 1;
        var tipo = "";
        var stringAlimentos = "";
        if (refeicao) {
            tipo = refeicao.tipo ? refeicao.tipo : "";
            var alimentos = refeicao.alimentos;
            if (alimentos) {
                for (let i = 0; i <= alimentos.length - 1; i++) {
                    if (i < alimentos.length - 1) {
                        stringAlimentos += `${alimentos[i].alimento} • `;
                    }
                    else {
                        stringAlimentos += alimentos[i].alimento;
                    }
                }
            }
        }
        const elemento = `<div class="refeicao" value="${this.id}">
            <a class="botao-editar-refeicao">
                <i class="fa fa-pencil" aria-hidden="true"></i>
            </a>
            <span class="refeicao-list-label">
            <h1>${tipo ? tipo : "Nova refeição"}</h1>
            ${stringAlimentos ? stringAlimentos : "..."}
            </span>
            <div class="botao-apagar-refeicao">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </div>
        </div>`;
        $(".lista-de-refeicoes").append(elemento);
    }
    removerRefeicao(refeicao) {
        var idApagado = parseInt(refeicao.getAttribute("value"));
        var elementosRestantes = document.querySelectorAll(".refeicao.hasEvent");
        if (elementosRestantes) {
            for (let i = idApagado; i <= elementosRestantes.length - 1; i++) {
                elementosRestantes[i].setAttribute("value", String(parseInt(elementosRestantes[i].getAttribute("value")) - 1));
            }
        }
        refeicao.remove();
    }
}
RefeicoesView._id = 1;
export default RefeicoesView;
