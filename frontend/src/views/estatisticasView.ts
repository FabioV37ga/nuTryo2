import EstatisticasController from "../controllers/calendarioController.js"

class EstatisticasView {
    constructor() {
    }

    selecionaPeriodo(periodo: string) {

        var periodos = document.querySelector(".janela-estatisticas-nav") as HTMLElement

        for (let i = 0; i <= 2; i++) {
            periodos.children[i].classList.remove("periodo-selecionado")
        }

        switch (periodo) {
            case "hoje":
                periodos.children[0].classList.add("periodo-selecionado")
                break;
            case "semanal":
                periodos.children[1].classList.add("periodo-selecionado")
                break;
            case "mensal":
                periodos.children[2].classList.add("periodo-selecionado")
                break;
        }
    }
}
export default EstatisticasView;
