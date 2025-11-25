import AlimentoController from "../controllers/alimentoController.js";
import CalendarioController from "../controllers/calendarioController.js";
import RefeicoesController from "../controllers/refeicoesController.js";
import diaObjeto from "../utils/diaObjeto.js";
import NutryoFetch from "../utils/nutryoFetch.js";
import AlimentoView from "./alimentoView.js";
import RefeicoesView from "./refeicoesView.js";

declare var $: any;
class JanelaView {

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Função responsável por criar um elemento DOM de aba
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

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Seleção visual da aba
    selecionaAba(aba: Element) {
        // Armazena elemento de abas selecionaveis do DOM
        const abasSelecionaveis = document.querySelectorAll(".abaSelecionavel")

        // Primeiro reseta estilização de todas as abas
        for (let i = 0; i <= abasSelecionaveis.length - 1; i++) {
            abasSelecionaveis[i].classList.remove("abaSelecionada")
        }

        // Seleciona a aba chamada como argumento
        aba.classList.add("abaSelecionada")

        // Faz busca pelas informações salvas do usuário
        var nutryoFetch = new NutryoFetch(diaObjeto.usuario)

        // Seleciona elementos de item na página
        var itensDeAlimento = document.querySelectorAll(".alimento-item")

        // Apaga os elementos de alimento na página
        for (let i = 1; i <= itensDeAlimento.length - 1; i++) {
            AlimentoView.apagarAlimento(itensDeAlimento[i])
        }

        // ! Mostra conteudo da aba (Entre aba refeições e abas refeição)

        // @Aba refeições (referente a janela com as refeições de um dia)
        if (aba.classList.contains("abaRefeicoes")) {

            // Define id da refeição como 1 (Isso auxilia outros lugares da aplicação a terem melhor acesso ao id da refeição sendo manipulada)
            RefeicoesView._id = 1;

            // Chama função para mostrar o conteúdo da aba selecionada
            this.mostrarConteudoAba("refeicoes")

            // Cria elementos da janela referentes a aba selecionada
            var refeicoesController = new RefeicoesController()
            refeicoesController.criarElementosDoDia(CalendarioController.dataSelecionada)

            // apaga elementos
            if (itensDeAlimento)
                for (let i = 1; i <= itensDeAlimento.length - 1; i++) {
                    AlimentoView.apagarAlimento(itensDeAlimento[i])
                }
        }

        // @Aba alimentos (referente a janela de alimentos dentro de uma refeição)
        else {
            // Chama função para mostrar alimentos da aba selecionada
            this.mostrarConteudoAba("refeicao")

            // Intervalo: só executa quando a requisição dos dados do usuário terminar
            var intervalo = setInterval(() => {
                if (NutryoFetch.status == 1) {

                    // Se houverem itens de alimento...
                    if (itensDeAlimento)
                        for (let i = 1; i <= itensDeAlimento.length - 1; i++) {
                            // apaga todos
                            AlimentoView.apagarAlimento(itensDeAlimento[i])
                        }

                    // Cria instância de alimento controller, para chamar funções de criação de elementos
                    var alimentoController = new AlimentoController()
                    // Retorna alimentos da refeição referente a aba selecionada
                    var alimentos = NutryoFetch.retornaAlimentosDaRefeicao(CalendarioController.dataSelecionada, aba.getAttribute("value") as string) as any[]
                    // Retorna refeição referente ao dia selecionado
                    var refeicao = NutryoFetch.retornaRefeicao(CalendarioController.dataSelecionada, aba.getAttribute("value") as string)

                    // Se houverem alimentos na refeição selecionada...
                    if (alimentos) {

                        // Cria elementos referentes aos alimentos
                        for (let i = 0; i <= alimentos.length - 1; i++) {
                            alimentoController.criarElementosDeAlimento(alimentos[i])
                        }

                        // Se houver refeição...
                        if (refeicao) {
                            // Elemento "Tipo de refeiçao"
                            var listlabel = document.querySelector(".refeicao-tipo-tipoSelecionado-label") as HTMLElement
                            // Define o texto do tipo de refeição a partir do tipo buscado no banco
                            listlabel.textContent = refeicao.tipo
                            // Mostra alimentos da refeição
                            var alimentosAdicionados = document.querySelector(".alimentos") as HTMLElement
                            alimentosAdicionados.style.display = "flex"
                        }

                    }
                    clearInterval(intervalo)
                }

            }, 1);
        }
        // Retorna aba criada (Outros lugares do sistema usam)
        return aba
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Apenas apaga/fecha a aba chamada como argumento
    apagaAba(aba: Element) {
        aba.remove()
        this.estilizaAbasAdicionais()
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por apagar todas as abas da janela
    apagaTodasAbas() {
        var abas = document.querySelectorAll(".abaSelecionavel")
        for (let i = 1; i <= abas.length - 1; i++) {
            abas[i].remove()
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por mostrar conteúdo das abas da janela
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

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por adicionar borda arredondada a abas que chegam no limite horizontal da janela (apenas a ultima aba)
    estilizaAbasAdicionais() {
        // Armazena elementos criados em elementoDOMCriado
        var elementoDOMCriado = document.querySelectorAll(".abaSelecionavel")

        // Sessão para tratar abas que ultrapassam o tamanho da janela
        for (let i = 0; i <= elementoDOMCriado.length - 1; i++) {
            elementoDOMCriado[i].classList.remove("abaExtraFinal")
        }

        // Desktop: A janela aguenta 4 abas antes de precisar de estilização especial
        if (window.innerWidth > 985) {
            if (elementoDOMCriado.length >= 5) {
                elementoDOMCriado[elementoDOMCriado.length - 1].classList.add("abaExtraFinal")
            }
        } 
        // Mobile: A janela aguenta 2 abas antes de precisar de estilização especial
        else {
            if (elementoDOMCriado.length >= 3)
                elementoDOMCriado[elementoDOMCriado.length - 1].classList.add("abaExtraFinal")
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Exclusivo mobile: Esconde a janela (Só cabe uma janela no mobile, então elas ocupam o mesmo espaço)
    esconderJanela() {
        var janela = document.querySelector(".janela") as HTMLElement

        janela.style.display = 'none'
    }
}

export default JanelaView