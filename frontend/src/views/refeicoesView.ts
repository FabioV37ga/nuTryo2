declare var $: any;

import JanelaView from "./janelaView.js";

class RefeicoesView extends JanelaView {
    static _id: number = 1
    id: number
    constructor() {
        super()
    }

    adicionarRefeicao(refeicao?: any) {
        this.id = RefeicoesView._id
        RefeicoesView._id += 1

        var tipo: string = "";
        var stringAlimentos: string = "";

        if (refeicao) {
            // console.log(refeicao)

            tipo = refeicao.tipo ? refeicao.tipo : ""
            var alimentos = refeicao.alimentos

            if (alimentos) {
                for (let i = 0; i <= alimentos.length - 1; i++) {
                    if (i < alimentos.length - 1) {
                        stringAlimentos += `${alimentos[i].alimento} • `
                    } else {
                        stringAlimentos += alimentos[i].alimento
                    }
                }
            }
        }


        const elemento =
            `<div class="refeicao" value="${this.id}">
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
        </div>`

        $(".lista-de-refeicoes").append(elemento)
    }

    removerRefeicao(refeicao: Element) {
        var idApagado: number = parseInt(refeicao.getAttribute("value") as string)
        var elementosRestantes = document.querySelectorAll(".refeicao.hasEvent")
        if (elementosRestantes) {
            for (let i = idApagado; i <= elementosRestantes.length - 1; i++) {
                elementosRestantes[i].setAttribute("value", String(parseInt(elementosRestantes[i].getAttribute("value") as string) - 1))
            }
        }
        refeicao.remove()
    }
    log() {
        console.log("Aves!")
    }
}

export default RefeicoesView;