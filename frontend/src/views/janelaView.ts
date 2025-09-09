import AlimentoController from "../controllers/alimentoController.js";
import CalendarioController from "../controllers/calendarioController.js";
import diaObjeto from "../utils/diaObjeto.js";
import NutryoFetch from "../utils/nutryoFetch.js";
import AlimentoView from "./alimentoView.js";
import RefeicoesView from "./refeicoesView.js";

declare var $: any;
class JanelaView {

    // Função responsável por criar um elemento DOM de aba
    criaAba(titulo: string, id: number) {

        // modelo do elemento a partir dos argumentos fornecidos ao chamar essa função
        const elementoAba: string =
            `<a class="aba abaSelecionavel refeicao-aba" value="${id}">
                    <div class="refeicao-label">${titulo}</div>
                    <span class="refeicao-fechar">
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </span>
                </a>`

        // Armazena abas existentes em elementosAbaDOM
        const elementosAbaDOM: NodeListOf<Element> = document.querySelectorAll(".refeicao-aba")

        // Só executa caso existam abas
        if (elementosAbaDOM && elementosAbaDOM.length > 0) {

            // Esse trecho impede a criação de duas abas iguais, se ela já está aberta, não cria outra.
            for (let i = 0; i <= elementosAbaDOM.length - 1; i++) {
                if (Number(elementosAbaDOM[i].getAttribute("value")) == id) {
                    break;
                }
                if (i == elementosAbaDOM.length - 1) {
                    // Caso já não exista uma instância dessa aba criada, cria essa instância
                    $(".janela-abas").append(elementoAba)
                }
            }
        } else {
            // Caso não tenha nenhuma aba, cria essa instância
            $(".janela-abas").append(elementoAba)
        }

        // Armazena elementos criados em elementoDOMCriado
        var elementoDOMCriado = document.querySelectorAll(".abaSelecionavel")

        this.estilizaAbasAdicionais()

        // Por fim, retorno lógico da referência do elemento que foi criado
        return elementoDOMCriado[elementoDOMCriado.length - 1]
    }

    // Seleção visual da aba
    selecionaAba(aba: Element) {
        // Armazena elemento de abas selecionaveis do DOM
        const abasSelecionaveis = document.querySelectorAll(".abaSelecionavel")

        // Primeiro reseta estilização de todas as abas
        for (let i = 0; i <= abasSelecionaveis.length - 1; i++) {
            abasSelecionaveis[i].classList.remove("abaSelecionada")
        }

        // Seleciona a aba chamada como argumento
        aba.classList.add("abaSelecionada")


        var itensDeAlimento = document.querySelectorAll(".alimento-item")
        for (let i = 1; i <= itensDeAlimento.length - 1; i++) {
            AlimentoView.apagarAlimento(itensDeAlimento[i])
        }
        // Mostra conteudo da aba (Entre aba refeições e abas refeição)
        if (aba.classList.contains("abaRefeicoes")) {
            RefeicoesView._id = 1;
            this.mostrarConteudoAba("refeicoes")
            // criar elementos
            if (itensDeAlimento)
                for (let i = 1; i <= itensDeAlimento.length - 1; i++) {
                    AlimentoView.apagarAlimento(itensDeAlimento[i])
                }

        }
        else {
            this.mostrarConteudoAba("refeicao")

            var nutryoFetch = new NutryoFetch(diaObjeto.usuario)

            var intervalo = setInterval(() => {
                if (NutryoFetch.status == 1) {
                    if (itensDeAlimento)
                        for (let i = 1; i <= itensDeAlimento.length - 1; i++) {
                            AlimentoView.apagarAlimento(itensDeAlimento[i])
                        }

                    var alimentoController = new AlimentoController()
                    var alimentos = NutryoFetch.retornaAlimentosDaRefeicao(CalendarioController.dataSelecionada, aba.getAttribute("value") as string) as any[]
                    var refeicao = NutryoFetch.retornaRefeicao(CalendarioController.dataSelecionada, aba.getAttribute("value") as string)

                    if (alimentos) {
                        for (let i = 0; i <= alimentos.length - 1; i++) {
                            alimentoController.criarElementosDeAlimento(alimentos[i])
                        }
                        if (refeicao) {
                            var listlabel = document.querySelector(".refeicao-tipo-tipoSelecionado-label") as HTMLElement
                            listlabel.textContent = refeicao.tipo
                            var alimentosAdicionados = document.querySelector(".alimentos") as HTMLElement
                            alimentosAdicionados.style.display = "flex"
                        }
                    }
                    clearInterval(intervalo)
                }

            }, 1);
        }

        return aba
    }

    // Apenas apaga/fecha a aba chamada como argumento
    apagaAba(aba: Element) {
        aba.remove()
        this.estilizaAbasAdicionais()
    }

    apagaTodasAbas() {
        var abas = document.querySelectorAll(".abaSelecionavel")

        for (let i = 1; i <= abas.length - 1; i++) {
            abas[i].remove()
        }
    }

    mostrarConteudoAba(tipo: string) {
        const conteudoRefeicoes = document.querySelector(".refeicoes-conteudo") as HTMLElement
        const conteudoRefeicao = document.querySelector(".refeicao-conteudo") as HTMLElement
        switch (tipo) {
            case "refeicoes":
                conteudoRefeicao.style.display = "none"
                conteudoRefeicoes.style.display = "flex"
                break;
            case "refeicao":
                conteudoRefeicoes.style.display = "none"
                conteudoRefeicao.style.display = "flex"
                break;
        }
    }

    estilizaAbasAdicionais() {
        // Armazena elementos criados em elementoDOMCriado
        var elementoDOMCriado = document.querySelectorAll(".abaSelecionavel")

        // Sessão para tratar abas que ultrapassam o tamanho da janela
        for (let i = 0; i <= elementoDOMCriado.length - 1; i++) {
            elementoDOMCriado[i].classList.remove("abaExtraFinal")
        }

        if (elementoDOMCriado.length >= 5) {
            elementoDOMCriado[elementoDOMCriado.length - 1].classList.add("abaExtraFinal")
        }
    }
}

export default JanelaView