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
        // console.log("CalendarioController Criado")
        this.calendarioView.criarElementos()
        this.adicionaEventosDeClick()

        // Marca data selecionada como a data atual.
        var dataSelecionada = this.calendarioView.retornaDataSelecionada()
        CalendarioController.dataSelecionada = `${dataSelecionada.dia}-${dataSelecionada.mes}-${dataSelecionada.ano}`

        // Troca a data display da janela pela data atual
        var display: Element = document.querySelector("#data-display") as Element
        display.textContent =
            `${String(dataSelecionada.dia).padStart(2, "0")}/${String(dataSelecionada.mes).padStart(2, "0")}/${dataSelecionada.ano}`

        // Gera objeto de dia
        var intervalo = setInterval(() => {
            if (NutryoFetch.objects){
                
                diaObjeto.gerarDia(
                    CalendarioController.dataSelecionada,
                    diaObjeto.usuario,
                    NutryoFetch.retornaRefeicoesDoDia(CalendarioController.dataSelecionada) ?
                        NutryoFetch.retornaRefeicoesDoDia(CalendarioController.dataSelecionada) :
                        []
                )
                clearInterval(intervalo)
            }
    
        }, 1);
    }
    adicionaEventosDeClick() {
        document.querySelector(".mes-ano-back")?.addEventListener("click", () => {
            this.calendarioView.navegar("tras")
        })
        document.querySelector(".mes-ano-forward")?.addEventListener("click", () => {
            this.calendarioView.navegar("frente")
        })

        // # clicar em um dia altera o dia selecionado
        var dias: NodeListOf<Element> = document.querySelectorAll(".dia")

        for (let i = 0; i <= dias.length - 1; i++) {
            dias[i].addEventListener("click", () => {
                // Tratamento mobile
                var janela = document.querySelector(".janela") as HTMLElement
                janela.style.display = 'initial'


                RefeicoesView._id = 1;

                var itensDeAlimento = document.querySelectorAll(".alimento-item")

                if (itensDeAlimento)
                    for (let i = 1; i <= itensDeAlimento.length - 1; i++) {
                        AlimentoView.apagarAlimento(itensDeAlimento[i])
                    }

                for (let j = 0; j <= dias.length - 1; j++) {
                    dias[j].classList.remove("diaSelecionado")
                }
                dias[i].classList.add("diaSelecionado")

                var dataSelecionada = this.calendarioView.retornaDataSelecionada()
                CalendarioController.dataSelecionada = `${dataSelecionada.dia}-${dataSelecionada.mes}-${dataSelecionada.ano}`
                var display: Element = document.querySelector("#data-display") as Element
                display.textContent =
                    `${String(dataSelecionada.dia).padStart(2, "0")}/${String(dataSelecionada.mes).padStart(2, "0")}/${dataSelecionada.ano}`

                // var nutryoFetch = new NutryoFetch(diaObjeto.usuario)

                var janelaController = new JanelaController()
                janelaController.janelaView.selecionaAba(document.querySelector(".abaRefeicoes") as Element)
                janelaController.janelaView.apagaTodasAbas()

                var intervalo = setInterval(() => {
                    if (NutryoFetch.status == 1){
                        diaObjeto.gerarDia(
                            CalendarioController.dataSelecionada,
                            diaObjeto.usuario,
                            NutryoFetch.retornaRefeicoesDoDia(CalendarioController.dataSelecionada) ?
                                NutryoFetch.retornaRefeicoesDoDia(CalendarioController.dataSelecionada) :
                                []
                        )
                        clearInterval(intervalo)
                    }
                }, 1);
            })
        }

    }
}

export default CalendarioController;