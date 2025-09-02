import CalendarioView from "../views/calendarioView.js";
class CalendarioController {
    constructor() {
        this.data = new Date();
        this.calendarioView = new CalendarioView(this.data);
        console.log("CalendarioController Criado");
        this.calendarioView.criarElementos();
        this.adicionaEventosDeClick();
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
                for (let j = 0; j <= dias.length - 1; j++) {
                    dias[j].classList.remove("diaSelecionado");
                }
                dias[i].classList.add("diaSelecionado");
                var dataSelecionada = this.calendarioView.retornaDataSelecionada();
                console.log(dataSelecionada);
                var display = document.querySelector("#data-display");
                console.log("teste");
                display.textContent = `${dataSelecionada.dia}/${dataSelecionada.mes}/${dataSelecionada.ano}`;
            });
        }
    }
}
export default CalendarioController;
