import CalendarioView from "../views/calendarioView.js";
class CalendarioController {
    private data: Date = new Date();
    private calendarioView = new CalendarioView(this.data);
    constructor() {
        console.log("CalendarioController Criado")
        this.calendarioView.criarElementos()
        this.adicionaEventosDeClick()

        var dataSelecionada = this.calendarioView.retornaDataSelecionada()
        var display: Element = document.querySelector("#data-display") as Element
        display.textContent =
            `${String(dataSelecionada.dia).padStart(2, "0")}/${String(dataSelecionada.mes).padStart(2, "0")}/${dataSelecionada.ano}`
    }
    adicionaEventosDeClick() {
        document.querySelector(".mes-ano-back")?.addEventListener("click", () => {
            this.calendarioView.navegar("tras")
        })
        document.querySelector(".mes-ano-forward")?.addEventListener("click", () => {
            this.calendarioView.navegar("frente")
        })
        var dias: NodeListOf<Element> = document.querySelectorAll(".dia")

        for (let i = 0; i <= dias.length - 1; i++) {
            dias[i].addEventListener("click", () => {
                for (let j = 0; j <= dias.length - 1; j++) {
                    dias[j].classList.remove("diaSelecionado")
                }
                dias[i].classList.add("diaSelecionado")

                var dataSelecionada = this.calendarioView.retornaDataSelecionada()
                var display: Element = document.querySelector("#data-display") as Element
                display.textContent =
                    `${String(dataSelecionada.dia).padStart(2, "0")}/${String(dataSelecionada.mes).padStart(2, "0")}/${dataSelecionada.ano}`
            })
        }

    }
}

export default CalendarioController;