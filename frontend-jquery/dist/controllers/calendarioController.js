import diaObjeto from "../utils/diaObjeto.js";
import NutryoFetch from "../utils/nutryoFetch.js";
import AlimentoView from "../views/alimentoView.js";
import CalendarioView from "../views/calendarioView.js";
import RefeicoesView from "../views/refeicoesView.js";
import JanelaController from "./janelaController.js";
class CalendarioController {
    constructor() {
        this.data = new Date();
        this.calendarioView = new CalendarioView(this.data);
        this.calendarioView.criarElementos();
        this.adicionaEventosDeClick();
        var dataSelecionada = this.calendarioView.retornaDataSelecionada();
        CalendarioController.dataSelecionada = `${dataSelecionada.dia}-${dataSelecionada.mes}-${dataSelecionada.ano}`;
        var display = document.querySelector("#data-display");
        display.textContent =
            `${String(dataSelecionada.dia).padStart(2, "0")}/${String(dataSelecionada.mes).padStart(2, "0")}/${dataSelecionada.ano}`;
        var intervalo = setInterval(() => {
            if (NutryoFetch.objects) {
                diaObjeto.gerarDia(CalendarioController.dataSelecionada, diaObjeto.usuario, NutryoFetch.retornaRefeicoesDoDia(CalendarioController.dataSelecionada) ?
                    NutryoFetch.retornaRefeicoesDoDia(CalendarioController.dataSelecionada) :
                    []);
                CalendarioView.adicionarEfeitosVisuais();
                clearInterval(intervalo);
            }
        }, 1);
    }
    adicionaEventosDeClick() {
        var _a, _b;
        (_a = document.querySelector(".mes-ano-back")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            this.calendarioView.navegar("tras");
        });
        (_b = document.querySelector(".mes-ano-forward")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            this.calendarioView.navegar("frente");
        });
        var dias = document.querySelectorAll(".dia");
        for (let i = 0; i <= dias.length - 1; i++) {
            dias[i].addEventListener("click", () => {
                var janela = document.querySelector(".janela");
                janela.style.display = 'initial';
                RefeicoesView._id = 1;
                var itensDeAlimento = document.querySelectorAll(".alimento-item");
                if (itensDeAlimento)
                    for (let i = 1; i <= itensDeAlimento.length - 1; i++) {
                        AlimentoView.apagarAlimento(itensDeAlimento[i]);
                    }
                for (let j = 0; j <= dias.length - 1; j++) {
                    dias[j].classList.remove("diaSelecionado");
                }
                dias[i].classList.add("diaSelecionado");
                var dataSelecionada = this.calendarioView.retornaDataSelecionada();
                CalendarioController.dataSelecionada = `${dataSelecionada.dia}-${dataSelecionada.mes}-${dataSelecionada.ano}`;
                var display = document.querySelector("#data-display");
                display.textContent =
                    `${String(dataSelecionada.dia).padStart(2, "0")}/${String(dataSelecionada.mes).padStart(2, "0")}/${dataSelecionada.ano}`;
                var janelaController = new JanelaController();
                janelaController.janelaView.selecionaAba(document.querySelector(".abaRefeicoes"));
                janelaController.janelaView.apagaTodasAbas();
                var intervalo = setInterval(() => {
                    if (NutryoFetch.status == 1) {
                        diaObjeto.gerarDia(CalendarioController.dataSelecionada, diaObjeto.usuario, NutryoFetch.retornaRefeicoesDoDia(CalendarioController.dataSelecionada) ?
                            NutryoFetch.retornaRefeicoesDoDia(CalendarioController.dataSelecionada) :
                            []);
                        clearInterval(intervalo);
                    }
                }, 1);
            });
        }
    }
}
CalendarioController.paginaMes = new Date().getMonth() + 1;
export default CalendarioController;
