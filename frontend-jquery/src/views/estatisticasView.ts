import EstatisticasController from "../controllers/calendarioController.js"

class EstatisticasView {
    constructor() {
    }

    selecionaPeriodo(periodo: string) {

        var periodos = document.querySelector(".janela-estatisticas-nav") as HTMLElement
        var botoesEdicao = document.querySelectorAll(".meta-edit") as NodeListOf<HTMLElement>

        for (let i = 0; i <= 2; i++) {
            periodos.children[i].classList.remove("periodo-selecionado")
        }

        switch (periodo) {
            case "hoje":
                periodos.children[0].classList.add("periodo-selecionado")
                mostraBotoesDeEdicao()
                break;
            case "semanal":
                periodos.children[1].classList.add("periodo-selecionado")
                escondeBotoesDeEdicao()
                break;
            case "mensal":
                periodos.children[2].classList.add("periodo-selecionado")
                escondeBotoesDeEdicao()
                break;
        }

        function escondeBotoesDeEdicao(){
            for (let i = 0; i<= 3; i++){
                botoesEdicao[i].style.display = "none"
            }
        }

        function mostraBotoesDeEdicao(){
            for (let i = 0; i<= 3; i++){
                botoesEdicao[i].style.display = "initial"
            }
        }
    }
}
export default EstatisticasView;
