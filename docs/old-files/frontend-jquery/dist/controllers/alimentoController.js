var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AlimentoView from "../views/alimentoView.js";
import { backend } from "../utils/connection.js";
import CalendarioController from "./calendarioController.js";
import JanelaController from "./janelaController.js";
import NutryoFetch from "../utils/nutryoFetch.js";
import diaObjeto from "../utils/diaObjeto.js";
class AlimentoController extends JanelaController {
    constructor() {
        super();
        this.alimentoView = new AlimentoView();
        this.botaoAdicionarAlimento = document.querySelector(".model-alimento");
        this.botaoEditarAlimento = document.querySelectorAll(".botao-editar-alimento");
        this.botaoApagarAlimento = document.querySelectorAll(".botao-apagar-alimento");
        this.adicionarEventosDeClick();
    }
    adicionarEventosDeClick() {
        if (!this.botaoAdicionarAlimento.classList.contains("hasEvent")) {
            this.botaoAdicionarAlimento.classList.add("hasEvent");
            this.botaoAdicionarAlimento.addEventListener("click", (e) => {
                e.stopPropagation;
                var alimentos = document.querySelectorAll(".alimento-item");
                var proximoID = 1;
                if (alimentos.length > 1) {
                    proximoID = parseInt(alimentos[alimentos.length - 1].getAttribute("value")) + 1;
                }
                AlimentoView.adicionarAlimento(CalendarioController.dataSelecionada, String(proximoID));
                this.botaoEditarAlimento = document.querySelectorAll(".botao-editar-alimento");
                this.botaoApagarAlimento = document.querySelectorAll(".botao-apagar-alimento");
                this.adicionarEventosDeClick();
            });
        }
        for (let i = 0; i <= this.botaoEditarAlimento.length - 1; i++) {
            if (!this.botaoEditarAlimento[i].classList.contains("hasEvent")) {
                this.botaoEditarAlimento[i].classList.add("hasEvent");
                this.botaoEditarAlimento[i].addEventListener("click", (e) => {
                    var _a;
                    e.stopPropagation;
                    var elementoClicado = e.currentTarget;
                    this.alimentoView.toggleJanelaDeEdicao((_a = elementoClicado.parentElement) === null || _a === void 0 ? void 0 : _a.children[3]);
                });
            }
            if (!this.botaoApagarAlimento[i].classList.contains("hasEvent")) {
                this.botaoApagarAlimento[i].classList.add("hasEvent");
                this.botaoApagarAlimento[i].addEventListener("click", (e) => {
                    e.stopPropagation;
                    var elementoClicado = e.currentTarget;
                    elementoClicado = elementoClicado.parentElement;
                    var refeicao = document.querySelector(".refeicao-tipo");
                    diaObjeto.apagarAlimento(refeicao.getAttribute("value"), elementoClicado.getAttribute("value"));
                    AlimentoView.apagarAlimento(elementoClicado);
                });
            }
        }
        var campoPesquisa = document.querySelectorAll(".selecao-valor-texto");
        for (let i = 0; i <= campoPesquisa.length - 1; i++) {
            if (!campoPesquisa[i].classList.contains("hasSearchEvent")) {
                campoPesquisa[i].classList.add("hasSearchEvent");
                campoPesquisa[i].addEventListener("input", (e) => {
                    e.stopPropagation;
                    var elemento = e.currentTarget;
                    this.pesquisaComDelay(elemento);
                });
            }
        }
        var resultadosPesquisa = document.querySelectorAll(".alimento-selecao-lista-item");
        for (let i = 0; i <= resultadosPesquisa.length - 1; i++) {
            if (!resultadosPesquisa[i].classList.contains("hasEvent")) {
                resultadosPesquisa[i].classList.add("hasEvent");
                resultadosPesquisa[i].addEventListener("click", (e) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                    var itemClicado = e.currentTarget;
                    this.selecionaItemPesquisado(itemClicado);
                    this.alimentoView.selecionaItemAlimento(itemClicado);
                    this.alimentoView.escondeResultadosNaLista((_b = (_a = itemClicado.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.children[2]);
                    var valores = this.retornaValoresInseridos((_e = (_d = (_c = itemClicado.parentElement) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.parentElement);
                    this.alimentoView.atualizarAlimento((_k = (_j = (_h = (_g = (_f = itemClicado.parentElement) === null || _f === void 0 ? void 0 : _f.parentElement) === null || _g === void 0 ? void 0 : _g.parentElement) === null || _h === void 0 ? void 0 : _h.parentElement) === null || _j === void 0 ? void 0 : _j.parentElement) === null || _k === void 0 ? void 0 : _k.children[1], valores);
                    this.enviaAlimento((_p = (_o = (_m = (_l = itemClicado.parentElement) === null || _l === void 0 ? void 0 : _l.parentElement) === null || _m === void 0 ? void 0 : _m.parentElement) === null || _o === void 0 ? void 0 : _o.parentElement) === null || _p === void 0 ? void 0 : _p.parentElement, valores);
                });
            }
        }
        var pesoConsumidoInput = document.querySelectorAll(".peso-valor-texto");
        for (let i = 0; i <= pesoConsumidoInput.length - 1; i++) {
            if (!pesoConsumidoInput[i].classList.contains("hasEvent")) {
                pesoConsumidoInput[i].classList.add("hasEvent");
                pesoConsumidoInput[i].addEventListener("input", (e) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                    var elementoManipulado = e.currentTarget;
                    var elementoPai = (_c = (_b = (_a = elementoManipulado.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.children[0];
                    var peso = elementoPai === null || elementoPai === void 0 ? void 0 : elementoPai.getAttribute("peso");
                    var calorias = elementoPai === null || elementoPai === void 0 ? void 0 : elementoPai.getAttribute("calorias");
                    var proteinas = elementoPai === null || elementoPai === void 0 ? void 0 : elementoPai.getAttribute("proteinas");
                    var gorduras = elementoPai === null || elementoPai === void 0 ? void 0 : elementoPai.getAttribute("gorduras");
                    var carbo = elementoPai === null || elementoPai === void 0 ? void 0 : elementoPai.getAttribute("carbo");
                    var pesoConsumido = elementoManipulado.value;
                    var macrosCalulados = this.calcularMacros(pesoConsumido, Number(peso), calorias, proteinas, gorduras, carbo);
                    this.alimentoView.preencheMacros((_e = (_d = elementoPai.parentElement) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.children[1], macrosCalulados.calorias, macrosCalulados.proteinas, macrosCalulados.gorduras, macrosCalulados.carbo);
                    var alimento = e.currentTarget;
                    alimento = (_j = (_h = (_g = (_f = alimento.parentElement) === null || _f === void 0 ? void 0 : _f.parentElement) === null || _g === void 0 ? void 0 : _g.parentElement) === null || _h === void 0 ? void 0 : _h.parentElement) === null || _j === void 0 ? void 0 : _j.parentElement;
                    var valores = this.retornaValoresInseridos(alimento.children[3]);
                    clearInterval(AlimentoController.AlimentoControllerTypeWeightInterval);
                    AlimentoController.AlimentoControllerTypeWeightInterval = setInterval(() => {
                        this.enviaAlimento(alimento, valores);
                        clearInterval(AlimentoController.AlimentoControllerTypeWeightInterval);
                    }, 300);
                    this.alimentoView.atualizarAlimento(alimento.children[1], valores);
                });
            }
        }
        var abasDeAlimento = document.querySelectorAll(".refeicao-aba");
        for (let i = 0; i <= abasDeAlimento.length - 1; i++) {
            if (!abasDeAlimento[i].classList.contains("hasCreateEvent")) {
                abasDeAlimento[i].classList.add("hasCreateEvent");
                abasDeAlimento[i].addEventListener("click", () => {
                    var alimentos = NutryoFetch.retornaAlimentosDaRefeicao(CalendarioController.dataSelecionada, abasDeAlimento[i].getAttribute("value"));
                });
            }
        }
    }
    criarElementosDeAlimento(alimento) {
        AlimentoView.adicionarAlimento(CalendarioController.dataSelecionada, alimento._id, alimento.alimento, alimento.peso, alimento.calorias, alimento.proteinas, alimento.gorduras, alimento.carboidratos);
        this.botaoEditarAlimento = document.querySelectorAll(".botao-editar-alimento");
        this.botaoApagarAlimento = document.querySelectorAll(".botao-apagar-alimento");
        setTimeout(() => {
            this.adicionarEventosDeClick();
        }, 100);
    }
    pesquisaComDelay(elemento) {
        clearInterval(AlimentoController.AlimentoControllerSearchInterval);
        AlimentoController.AlimentoControllerSearchInterval = setInterval(() => {
            this.pesquisa(elemento);
            clearInterval(AlimentoController.AlimentoControllerSearchInterval);
        }, 300);
    }
    pesquisa(elemento) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const campoPesquisa = (_b = (_a = elemento.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.children[1].children[0];
            const alimentoPesquisado = campoPesquisa.value;
            if (alimentoPesquisado.replaceAll(" ", "") != "") {
                alimentoPesquisado.trim().replaceAll(" ", "%20");
                const resposta = yield fetch(`${backend}/alimentos/buscar?nome=${alimentoPesquisado}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "Application/json"
                    }
                });
                const dados = yield resposta.json();
                if (dados) {
                    this.alimentoView.mostraResultadosNaLista(dados, elemento);
                }
            }
            else {
                this.alimentoView.escondeResultadosNaLista((_d = (_c = elemento.parentElement) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.children[2]);
            }
        });
    }
    selecionaItemPesquisado(elemento) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var peso;
            var calorias;
            var proteinas;
            var gorduras;
            var carbo;
            try {
                const alimentoSelecionadoFetch = yield fetch(`${backend}/alimentos/${elemento.getAttribute("value")}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "Application/json"
                    }
                });
                const alimentoSelecionado = yield alimentoSelecionadoFetch.json();
                peso = yield parseFloat(alimentoSelecionado.peso).toFixed(2);
                calorias = yield parseFloat(alimentoSelecionado.calorias).toFixed(2);
                proteinas = yield parseFloat(alimentoSelecionado.proteinas).toFixed(2);
                gorduras = yield parseFloat(alimentoSelecionado.lipidios).toFixed(2);
                carbo = yield parseFloat(alimentoSelecionado.carboidrato).toFixed(2);
                var labels = (_a = elemento.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
                labels === null || labels === void 0 ? void 0 : labels.setAttribute("peso", yield String(peso));
                labels === null || labels === void 0 ? void 0 : labels.setAttribute("calorias", yield String(calorias));
                labels === null || labels === void 0 ? void 0 : labels.setAttribute("proteinas", yield String(proteinas));
                labels === null || labels === void 0 ? void 0 : labels.setAttribute("gorduras", yield String(gorduras));
                labels === null || labels === void 0 ? void 0 : labels.setAttribute("carbo", yield String(carbo));
            }
            catch (error) {
                console.log(error);
            }
            finally {
                const campoPesoConsumido = (_d = (_c = (_b = elemento.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.children[1].children[1].children[0];
                var pesoConsumido = campoPesoConsumido.value;
                pesoConsumido = pesoConsumido == "" ? 0 : parseInt(pesoConsumido);
                var macrosCalulados = this.calcularMacros(pesoConsumido, 100, calorias, proteinas, gorduras, carbo);
                this.alimentoView.preencheMacros((_h = (_g = (_f = (_e = elemento.parentElement) === null || _e === void 0 ? void 0 : _e.parentElement) === null || _f === void 0 ? void 0 : _f.parentElement) === null || _g === void 0 ? void 0 : _g.parentElement) === null || _h === void 0 ? void 0 : _h.children[1], macrosCalulados.calorias, macrosCalulados.proteinas, macrosCalulados.gorduras, macrosCalulados.carbo);
            }
        });
    }
    calcularMacros(pesoConsumido, pesoReferencia, calorias, proteinas, gorduras, carbo) {
        var referencia = pesoReferencia ? pesoReferencia : 100;
        var caloriasConsumidas = ((pesoConsumido * calorias) / referencia).toFixed(2);
        var proteinasConsumidas = ((pesoConsumido * proteinas) / referencia).toFixed(2);
        var gordurasConsumidas = ((pesoConsumido * gorduras) / referencia).toFixed(2);
        var carboConsumidos = ((pesoConsumido * carbo) / referencia).toFixed(2);
        return {
            calorias: caloriasConsumidas,
            proteinas: proteinasConsumidas,
            gorduras: gordurasConsumidas,
            carbo: carboConsumidos
        };
    }
    retornaValoresInseridos(alimento) {
        var janela = alimento;
        var consumo = janela.children[0];
        var macros = janela.children[1];
        var nome = consumo.children[0].children[1].children[0].value;
        var peso = consumo.children[1].children[1].children[0].value;
        var calorias = macros.children[0].children[1].textContent;
        var proteinas = macros.children[1].children[1].textContent;
        var carboidratos = macros.children[2].children[1].textContent;
        var gorduras = macros.children[3].children[1].textContent;
        if (nome && peso && calorias && proteinas && carboidratos && gorduras) {
            return {
                nome: nome,
                peso: peso,
                calorias: calorias,
                proteinas: proteinas,
                carboidratos: carboidratos,
                gorduras: gorduras
            };
        }
        else {
            return false;
        }
    }
    enviaAlimento(elemento, valores) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log("#AlimentoController - Mudanças no alimento detectadas, fazendo envio das atualizações");
            if (valores) {
                yield NutryoFetch.nutryo.fetchDias(diaObjeto.usuario);
                var refeicaoAtual = (_a = document.querySelector(".refeicao-tipo")) === null || _a === void 0 ? void 0 : _a.getAttribute("value");
                diaObjeto.gerarAlimento(refeicaoAtual, String(Number(elemento.getAttribute("value"))), valores.nome, valores.peso, valores.calorias, valores.proteinas, valores.carboidratos, valores.gorduras);
            }
        });
    }
}
export default AlimentoController;
