import diaObjeto from "../utils/diaObjeto.js";
import NutryoFetch from "../utils/nutryoFetch.js";
import RefeicoesView from "../views/refeicoesView.js";
import JanelaController from "./janelaController.js";
class RefeicoesController extends JanelaController {
    constructor() {
        super();
        this.refeicoesView = new RefeicoesView();
        this.refeicoesNaJanela = [];
        this.adicionaEventosDeClick();
    }
    adicionaEventosDeClick() {
        this.itemRefeicao = document.querySelectorAll(".refeicao");
        for (let i = 1; i <= this.itemRefeicao.length - 1; i++) {
            if (!this.itemRefeicao[i].classList.contains("hasEvent")) {
                this.itemRefeicao[i].classList.add("hasEvent");
                this.itemRefeicao[i].children[0].addEventListener("click", (e) => {
                    e.stopPropagation;
                    var elementoClicado = e.currentTarget;
                    var titulo = this.itemRefeicao[i].textContent.toString().trim().split(" ")[0];
                    var id = Number(this.itemRefeicao[i].getAttribute("value"));
                    var abaCriada = this.refeicoesView.criaAba(titulo, id);
                    this.refeicoesView.selecionaAba(abaCriada);
                    var tipo = document.querySelector(".refeicao-tipo");
                    tipo.setAttribute("value", String(id));
                    this.adicionaEventosDeClick();
                    super.adicionaEventosDeClick();
                });
                this.itemRefeicao[i].children[2].addEventListener("click", (e) => {
                    var _a;
                    var item = e.currentTarget;
                    diaObjeto.apagarRefeicao((_a = item.parentElement) === null || _a === void 0 ? void 0 : _a.getAttribute("value"));
                    this.refeicoesView.removerRefeicao(item.parentElement);
                });
            }
        }
        this.botaoAdicionarRefeicao = document.querySelector(".model-refeicao");
        if (!this.botaoAdicionarRefeicao.classList.contains("hasEvent")) {
            this.botaoAdicionarRefeicao.classList.add("hasEvent");
            this.botaoAdicionarRefeicao.addEventListener("click", () => {
                var alimentos = document.querySelector(".alimentos");
                alimentos.style.display = "none";
                var tipo = document.querySelector(".refeicao-tipo");
                tipo.children[1].children[0].textContent = "Selecione o tipo";
                var itens = document.querySelectorAll(".refeicao");
                RefeicoesView._id = parseInt(itens[itens.length - 1].getAttribute("value")) + 1;
                tipo.setAttribute("value", String(RefeicoesView._id));
                this.refeicoesView.adicionarRefeicao();
                this.adicionaEventosDeClick();
            });
        }
    }
    criarElementosDoDia(data) {
        var refeicoesNoDOM = document.querySelectorAll(".refeicao");
        for (let refeicaoDOM = 1; refeicaoDOM <= refeicoesNoDOM.length - 1; refeicaoDOM++) {
            refeicoesNoDOM[refeicaoDOM].remove();
        }
        var intervalo = setInterval(() => {
            if (NutryoFetch.status == 1) {
                var refeicoesDoDia = NutryoFetch.retornaRefeicoesDoDia(data);
                if (refeicoesDoDia) {
                    for (let refeicao = 0; refeicao <= refeicoesDoDia.length - 1; refeicao++) {
                        this.criarElementosDeRefeicao(refeicoesDoDia[refeicao]);
                    }
                }
                clearInterval(intervalo);
            }
        }, 1);
    }
    criarElementosDeRefeicao(refeicao) {
        this.refeicoesView.adicionarRefeicao(refeicao);
        this.adicionaEventosDeClick();
    }
}
export default RefeicoesController;
