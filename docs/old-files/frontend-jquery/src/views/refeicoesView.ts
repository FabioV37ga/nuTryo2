declare var $: any;

import JanelaView from "./janelaView.js";

class RefeicoesView extends JanelaView {
    static _id: number = 1
    id: number
    constructor() {
        super()
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por adicionar uma refeição a janela
    adicionarRefeicao(refeicao?: any) {
        // Atribui ID
        this.id = RefeicoesView._id
        // Incrementa ID + 1 para adiciona a proxima refeição
        RefeicoesView._id += 1

        // Inicializa Strings de tipo e label da refeição
        var tipo: string = "";
        var stringAlimentos: string = "";

        // Se houver atributo de refeição...
        if (refeicao) {
            // Define o tipo, se houver
            tipo = refeicao.tipo ? refeicao.tipo : ""
            var alimentos = refeicao.alimentos

            // Se houverem alimentos na refeição...
            if (alimentos) {
                // Adiciona título aos alimentos criados (Alimentos que compõem a refeição)
                for (let i = 0; i <= alimentos.length - 1; i++) {
                    if (i < alimentos.length - 1) {
                        stringAlimentos += `${alimentos[i].alimento} • `
                    } else {
                        stringAlimentos += alimentos[i].alimento
                    }
                }
            }
        }

        // Modelo do elemento a ser criado no DOM
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

        // cria elemento
        $(".lista-de-refeicoes").append(elemento)
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por remover visualmente uma refeição
    removerRefeicao(refeicao: Element) {
        // Armazena ID da refeição a ser apagada (passado dentro do elemento passado como parâmetro do método)
        var idApagado: number = parseInt(refeicao.getAttribute("value") as string)

        // Elementos de refeição restantes no DOM
        var elementosRestantes = document.querySelectorAll(".refeicao.hasEvent")

        // Se houverem elementos restantes...
        if (elementosRestantes) {
            // Decrementa o ID das refeições restantes (Se houverem ID maior do que o ID apagado)
            for (let i = idApagado; i <= elementosRestantes.length - 1; i++) {
                elementosRestantes[i].setAttribute("value", String(parseInt(elementosRestantes[i].getAttribute("value") as string) - 1))
            }
        }
        // Apaga refeição passada como parâmetro
        refeicao.remove()
    }
}

export default RefeicoesView;