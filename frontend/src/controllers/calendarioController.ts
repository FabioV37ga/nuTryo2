import diaObjeto from "../utils/diaObjeto.js";
import NutryoFetch from "../utils/nutryoFetch.js";
import AlimentoView from "../views/alimentoView.js";
import CalendarioView from "../views/calendarioView.js";
import RefeicoesView from "../views/refeicoesView.js";
import JanelaController from "./janelaController.js";

class CalendarioController {
    private data: Date = new Date();
    private calendarioView = new CalendarioView(this.data);
    static dataSelecionada: string;
    constructor() {

        // Cria elementos do calendário
        this.calendarioView.criarElementos()

        // Chama função para adicionar eventos de click aos elementos criados
        this.adicionaEventosDeClick()

        // Marca data selecionada como a data atual.
        var dataSelecionada = this.calendarioView.retornaDataSelecionada()
        CalendarioController.dataSelecionada = `${dataSelecionada.dia}-${dataSelecionada.mes}-${dataSelecionada.ano}`

        // Troca a data display da janela pela data atual
        var display: Element = document.querySelector("#data-display") as Element
        display.textContent =
            `${String(dataSelecionada.dia).padStart(2, "0")}/${String(dataSelecionada.mes).padStart(2, "0")}/${dataSelecionada.ano}`

        // Gera objeto de dia (Apenas quando a requisição pelos objetos terminar)
        var intervalo = setInterval(() => {
            if (NutryoFetch.objects) {

                // Gera objetos - Se houverem objetos existentes no banco, gera objetos a partir deles, se não houver, gera objeto vazio
                diaObjeto.gerarDia(
                    CalendarioController.dataSelecionada,
                    diaObjeto.usuario,
                    NutryoFetch.retornaRefeicoesDoDia(CalendarioController.dataSelecionada) ?
                        NutryoFetch.retornaRefeicoesDoDia(CalendarioController.dataSelecionada) :
                        []
                )

                // limpa intervalo
                clearInterval(intervalo)
            }
        }, 1);
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Função responsável por adicionar eventos aos elementos do calendário
    adicionaEventosDeClick() {

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // Navegação "<-" (voltar mês)
        document.querySelector(".mes-ano-back")?.addEventListener("click", () => {
            // Volta visualmente um mês no calendario
            this.calendarioView.navegar("tras")
        })
        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // Navegação "->" (avançar mês)
        document.querySelector(".mes-ano-forward")?.addEventListener("click", () => {
            // Avança visualmente um mês no calendario
            this.calendarioView.navegar("frente")
        })

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # clicar em um dia altera o dia selecionado

        // Armazena elementos dos dias
        var dias: NodeListOf<Element> = document.querySelectorAll(".dia")

        // Adiciona eventos em todos os elementos de dias
        for (let i = 0; i <= dias.length - 1; i++) {

            // Adiciona evento de click
            dias[i].addEventListener("click", () => {

                // Tratamento mobile (A janela inicia com display none no mobile, clicar em dia mostra a janela)
                var janela = document.querySelector(".janela") as HTMLElement
                janela.style.display = 'initial'

                // Inicializa ID das refeições em 1, auxilia na criação das refeições posteriormente
                RefeicoesView._id = 1;

                // Armazena elementos de alimento
                var itensDeAlimento = document.querySelectorAll(".alimento-item")

                // Apaga elementos de alimento quando o dia é trocado
                if (itensDeAlimento)
                    for (let i = 1; i <= itensDeAlimento.length - 1; i++) {
                        AlimentoView.apagarAlimento(itensDeAlimento[i])
                    }

                // Seleciona visualmente o dia (Faz um highlight em azul no dia selecionado no calendário)
                for (let j = 0; j <= dias.length - 1; j++) {
                    // Primeiro remove o dia selecionado anteriormente
                    dias[j].classList.remove("diaSelecionado")
                }
                // Depois seleciona o item clicado
                dias[i].classList.add("diaSelecionado")

                // Ao clicar em um dia, esse dia passa a ser a data selecionada
                var dataSelecionada = this.calendarioView.retornaDataSelecionada()

                // Formata a data selecionada separando dia, mes e ano por hífen
                CalendarioController.dataSelecionada = `${dataSelecionada.dia}-${dataSelecionada.mes}-${dataSelecionada.ano}`

                // Armazena o display de data da janela
                var display: Element = document.querySelector("#data-display") as Element
                
                // Troca o display da data selecionada da janela pelo dia selecionado
                display.textContent =
                    `${String(dataSelecionada.dia).padStart(2, "0")}/${String(dataSelecionada.mes).padStart(2, "0")}/${dataSelecionada.ano}`

                // Ao selecionar um dia, a aba selecionada da janela precisa ser a aba "Refeições", então chama métodos para fazer isso
                // Cria instância de controller de janela (da pra melhorar isso)
                var janelaController = new JanelaController()

                // Seleciona aba refeicoes
                janelaController.janelaView.selecionaAba(document.querySelector(".abaRefeicoes") as Element)

                // Apaga outras abas abertas
                janelaController.janelaView.apagaTodasAbas()

                // Só executa o trecho lógico quando a requisição de refeições terminar
                var intervalo = setInterval(() => {
                    if (NutryoFetch.status == 1) {

                        // Gera um dia (Se já existe no banco, referencia ele, se não existe, cria um dia vazio)
                        diaObjeto.gerarDia(
                            CalendarioController.dataSelecionada,
                            diaObjeto.usuario,
                            NutryoFetch.retornaRefeicoesDoDia(CalendarioController.dataSelecionada) ?
                                NutryoFetch.retornaRefeicoesDoDia(CalendarioController.dataSelecionada) :
                                []
                        )

                        // Limpa intervalo
                        clearInterval(intervalo)
                    }
                }, 1);
            })
        }

    }
}

export default CalendarioController;