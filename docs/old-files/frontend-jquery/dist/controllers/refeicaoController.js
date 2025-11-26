import diaObjeto from "../utils/diaObjeto.js";
import NutryoFetch from "../utils/nutryoFetch.js";
import RefeicaoView from "../views/refeicaoView.js";
import CalendarioController from "./calendarioController.js";
class RefeicaoController {
    constructor() {
        this.refeicaoView = new RefeicaoView();
        this.listaTipoLabel = document.querySelector(".refeicao-tipo-tipoSelecionado");
        this.listaTipos = document.querySelector(".refeicao-tipo-list");
        this.listaTiposItem = document.querySelectorAll(".refeicao-tipo-list li");
        this.adicionaEventosDeClick();
    }
    adicionaEventosDeClick() {
        if (!this.listaTipoLabel.classList.contains("hasEvent")) {
            this.listaTipoLabel.classList.add("hasEvent");
            this.listaTipoLabel.addEventListener("click", (e) => {
                e.stopPropagation;
                this.refeicaoView.toggleListaDeTipos();
            });
        }
        for (let i = 0; i <= this.listaTiposItem.length - 1; i++) {
            if (!this.listaTiposItem[i].classList.contains("hasEvent")) {
                this.listaTiposItem[i].classList.add("hasEvent");
                this.listaTiposItem[i].addEventListener("click", (e) => {
                    var _a, _b, _c, _d, _e;
                    e.stopPropagation;
                    var elementoClicado = e.currentTarget;
                    this.refeicaoView.selecionaItem(elementoClicado);
                    this.refeicaoView.toggleListaDeTipos();
                    var refeicao = NutryoFetch.retornaRefeicao(CalendarioController.dataSelecionada, (_b = (_a = elementoClicado.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.getAttribute("value"));
                    if (refeicao) {
                        diaObjeto.editarTipoRefeicao(refeicao._id, elementoClicado.textContent);
                    }
                    else {
                        diaObjeto.gerarRefeicao(Number((_d = (_c = elementoClicado.parentElement) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.getAttribute("value")), elementoClicado.textContent, []);
                    }
                    var refeicaoAtual = (_e = document.querySelector(".abaSelecionada")) === null || _e === void 0 ? void 0 : _e.getAttribute("value");
                    this.refeicaoView.trocaTipo(refeicaoAtual, elementoClicado.textContent);
                });
            }
        }
    }
}
export default RefeicaoController;
