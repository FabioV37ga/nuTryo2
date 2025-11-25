var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import NutryoFetch from "../utils/nutryoFetch.js";
import { backend } from "../utils/connection.js";
import EstatisticasView from "../views/estatisticasView.js";
import diaObjeto from "../utils/diaObjeto.js";
class EstatisticasController {
    constructor() {
        this.estatisticasView = new EstatisticasView();
        this.estatisticasView = new EstatisticasView();
        this.periodoSelecionado = "hoje";
        this.defineElementos();
        this.adicionaEventosDeClick();
        var intervalo = setInterval(() => {
            if (NutryoFetch.objects && NutryoFetch.metas) {
                this.calculaEstatisticas();
                clearInterval(intervalo);
            }
        }, 1);
    }
    defineElementos() {
        EstatisticasController.janelaEstatisticas = document.querySelector(".janela-estatisticas");
        EstatisticasController.caloriasConsumidasElemento = document.querySelector(".info-consumo-kcal");
        EstatisticasController.proteinasConsumidasElemento = document.querySelector(".info-consumo-prots");
        EstatisticasController.carboidratosConsumidasElemento = document.querySelector(".info-consumo-carbs");
        EstatisticasController.gordurasConsumidasElemento = document.querySelector(".info-consumo-gords");
        EstatisticasController.caloriasMetaElemento = document.querySelector(".info-meta-kcal input");
        EstatisticasController.proteinasMetaElemento = document.querySelector(".info-meta-prots input");
        EstatisticasController.carboidratosMetaElemento = document.querySelector(".info-meta-carbs input");
        EstatisticasController.gordurasMetaElemento = document.querySelector(".info-meta-gords input");
        EstatisticasController.porcentagemCalorias = document.querySelector(".kcal-progress");
        EstatisticasController.porcentagemProteinas = document.querySelector(".prot-progress");
        EstatisticasController.porcentagemCarboidratos = document.querySelector(".carbs-progress");
        EstatisticasController.porcentagemGorduras = document.querySelector(".gords-progress");
        EstatisticasController.statsDiaElemento = document.querySelector(".estatisticas-hoje");
        EstatisticasController.statsSemanaElemento = document.querySelector(".estatisticas-semana");
        EstatisticasController.statsMensalElemento = document.querySelector(".estatisticas-totais");
        EstatisticasController.botaoAcessarEstatisticas = document.querySelector(".estatisticas-ico");
        EstatisticasController.botaoFecharEstatisticas = document.querySelector(".janela-estatisticas-close");
    }
    adicionaEventosDeClick() {
        EstatisticasController.botaoAcessarEstatisticas.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            yield NutryoFetch.nutryo.fetchMetas(diaObjeto.usuario);
            this.selecionaPeriodo("hoje");
            var dados = yield this.calculaEstatisticas();
            this.preencheEstatisticasConsumo(dados);
            EstatisticasController.janelaEstatisticas.style.display = "initial";
        }));
        EstatisticasController.botaoFecharEstatisticas.addEventListener("click", () => {
            EstatisticasController.janelaEstatisticas.style.display = "none";
        });
        var botoesEditarMeta = document.querySelectorAll(".meta-edit");
        for (let i = 0; i <= botoesEditarMeta.length - 1; i++) {
            botoesEditarMeta[i].addEventListener("click", (e) => {
                var _a;
                e.stopPropagation;
                var botaoPressionado = e.currentTarget;
                var campoMeta = (_a = botaoPressionado.parentElement) === null || _a === void 0 ? void 0 : _a.children[2].children[0];
                console.log(campoMeta);
                campoMeta.disabled = false;
                campoMeta.focus();
            });
        }
        var camposMeta = document.querySelectorAll(".informacoes-meta input");
        for (let i = 0; i <= camposMeta.length - 1; i++) {
            camposMeta[i].addEventListener("input", (e) => {
                e.stopPropagation;
                var campoTarget = e.currentTarget;
                this.defineMeta(campoTarget);
            });
            camposMeta[i].addEventListener("blur", (e) => {
                e.stopPropagation;
                var campoTarget = e.currentTarget;
                campoTarget.disabled = 'true';
            });
        }
        EstatisticasController.statsDiaElemento.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            this.selecionaPeriodo("hoje");
            var dados = yield this.calculaEstatisticas();
            this.preencheEstatisticasConsumo(dados);
        }));
        EstatisticasController.statsSemanaElemento.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            this.selecionaPeriodo("semanal");
            var dados = yield this.calculaEstatisticas();
            this.preencheEstatisticasConsumo(dados);
        }));
        EstatisticasController.statsMensalElemento.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            this.selecionaPeriodo("mensal");
            var dados = yield this.calculaEstatisticas();
            this.preencheEstatisticasConsumo(dados);
        }));
    }
    calculaEstatisticas() {
        return __awaiter(this, void 0, void 0, function* () {
            yield NutryoFetch.nutryo.fetchMetas(diaObjeto.usuario);
            var metas = this.retornaMetas(this.periodoSelecionado);
            this.preencheEstatisticasMetas(metas);
            var caloriasTotais = 0;
            var proteinasTotais = 0;
            var carboidratosTotais = 0;
            var gordurasTotais = 0;
            switch (this.periodoSelecionado) {
                case "hoje":
                    var data = new Date();
                    var stringData = `${data.getDate()}-${data.getMonth() + 1}-${data.getFullYear()}`;
                    var refeicoes = NutryoFetch.retornaRefeicoesDoDia(stringData);
                    if (refeicoes) {
                        for (let i = 0; i <= refeicoes.length - 1; i++) {
                            var alimento = NutryoFetch.retornaAlimentosDaRefeicao(stringData, String(i + 1));
                            somaValores(alimento);
                        }
                    }
                    break;
                case "semanal":
                    var hoje = new Date();
                    var diaSemanaAtual = hoje.getDay();
                    var domingo = new Date(hoje);
                    domingo.setDate(hoje.getDate() - diaSemanaAtual);
                    for (let i = 0; i <= 6; i++) {
                        var diaSemana = new Date(domingo);
                        diaSemana.setDate(diaSemana.getDate() + i);
                        var stringData = `${diaSemana.getDate()}-${diaSemana.getMonth() + 1}-${diaSemana.getFullYear()}`;
                        var refeicoesDoDia = NutryoFetch.retornaRefeicoesDoDia(stringData);
                        if (refeicoesDoDia) {
                            for (let i = 0; i <= refeicoesDoDia.length - 1; i++) {
                                var alimento = NutryoFetch.retornaAlimentosDaRefeicao(stringData, String(i + 1));
                                somaValores(alimento);
                            }
                        }
                    }
                    break;
                case "mensal":
                    var dataAtual = new Date();
                    var mesAtual = dataAtual.getMonth();
                    var anoAtual = dataAtual.getFullYear();
                    for (let i = 1; i <= 31; i++) {
                        var stringData = `${i}-${mesAtual + 1}-${anoAtual}`;
                        var refeicoesDoDia = NutryoFetch.retornaRefeicoesDoDia(stringData);
                        if (refeicoesDoDia) {
                            for (let i = 0; i <= refeicoesDoDia.length - 1; i++) {
                                var alimento = NutryoFetch.retornaAlimentosDaRefeicao(stringData, String(i + 1));
                                somaValores(alimento);
                            }
                        }
                    }
                    break;
            }
            function somaValores(alimento) {
                for (let a = 0; a <= alimento.length - 1; a++) {
                    caloriasTotais += Number(alimento[a].calorias);
                    proteinasTotais += Number(alimento[a].proteinas);
                    carboidratosTotais += Number(alimento[a].carboidratos);
                    gordurasTotais += Number(alimento[a].gorduras);
                }
            }
            var porcentagemCalorias = (caloriasTotais * 100) / metas.metaCalorias;
            var porcentagemProteinas = (proteinasTotais * 100) / metas.metaProteinas;
            var porcentagemCarboidratos = (carboidratosTotais * 100) / metas.metaCarboidratos;
            var porcentagemGorduras = (gordurasTotais * 100) / metas.metaGorduras;
            return {
                "caloriasTotais": caloriasTotais,
                "porcentagemCalorias": porcentagemCalorias,
                "proteinasTotais": proteinasTotais,
                "porcentagemProteinas": porcentagemProteinas,
                "carboidratosTotais": carboidratosTotais,
                "porcentagemCarboidratos": porcentagemCarboidratos,
                "gordurasTotais": gordurasTotais,
                "porcentagemGorduras": porcentagemGorduras
            };
        });
    }
    retornaMetas(periodo) {
        var metas = {
            "metaCalorias": Number(NutryoFetch.metas.metaCalorias),
            "metaProteinas": Number(NutryoFetch.metas.metaProteinas),
            "metaCarboidratos": Number(NutryoFetch.metas.metaCarboidratos),
            "metaGorduras": Number(NutryoFetch.metas.metaGorduras)
        };
        switch (periodo) {
            case "hoje":
                return metas;
            case "semanal":
                return {
                    metaCalorias: metas.metaCalorias * 7,
                    metaProteinas: metas.metaProteinas * 7,
                    metaCarboidratos: metas.metaCarboidratos * 7,
                    metaGorduras: metas.metaGorduras * 7
                };
            case "mensal":
                return {
                    metaCalorias: metas.metaCalorias * 30,
                    metaProteinas: metas.metaProteinas * 30,
                    metaCarboidratos: metas.metaCarboidratos * 30,
                    metaGorduras: metas.metaGorduras * 30
                };
        }
    }
    preencheEstatisticasConsumo(dados) {
        EstatisticasController.caloriasConsumidasElemento.textContent = `${dados.caloriasTotais.toFixed(0)} kcal`;
        dados.porcentagemCalorias = dados.porcentagemCalorias <= 100 ? dados.porcentagemCalorias : 100;
        EstatisticasController.porcentagemCalorias.style.width = dados.porcentagemCalorias + "%";
        EstatisticasController.proteinasConsumidasElemento.textContent = `${dados.proteinasTotais.toFixed(0)} g`;
        dados.porcentagemProteinas = dados.porcentagemProteinas <= 100 ? dados.porcentagemProteinas : 100;
        EstatisticasController.porcentagemProteinas.style.width = dados.porcentagemProteinas + "%";
        EstatisticasController.carboidratosConsumidasElemento.textContent = `${dados.carboidratosTotais.toFixed(0)} g`;
        dados.porcentagemCarboidratos = dados.porcentagemCarboidratos <= 100 ? dados.porcentagemCarboidratos : 100;
        EstatisticasController.porcentagemCarboidratos.style.width = dados.porcentagemCarboidratos + "%";
        EstatisticasController.gordurasConsumidasElemento.textContent = `${dados.gordurasTotais.toFixed(0)} g`;
        dados.porcentagemGorduras = dados.porcentagemGorduras <= 100 ? dados.porcentagemGorduras : 100;
        EstatisticasController.porcentagemGorduras.style.width = dados.porcentagemGorduras + "%";
    }
    preencheEstatisticasMetas(metas) {
        EstatisticasController.caloriasMetaElemento.value = metas.metaCalorias;
        EstatisticasController.caloriasMetaElemento.style.width = metas.metaCalorias.toString().split("").length * 16 + "px";
        EstatisticasController.proteinasMetaElemento.value = metas.metaProteinas;
        EstatisticasController.proteinasMetaElemento.style.width = metas.metaProteinas.toString().split("").length * 16 + "px";
        EstatisticasController.carboidratosMetaElemento.value = metas.metaCarboidratos;
        EstatisticasController.carboidratosMetaElemento.style.width = metas.metaCarboidratos.toString().split("").length * 16 + "px";
        EstatisticasController.gordurasMetaElemento.value = metas.metaGorduras;
        EstatisticasController.gordurasMetaElemento.style.width = metas.metaGorduras.toString().split("").length * 16 + "px";
    }
    selecionaPeriodo(periodo) {
        this.periodoSelecionado = periodo;
        this.estatisticasView.selecionaPeriodo(periodo);
    }
    defineMeta(input) {
        return __awaiter(this, void 0, void 0, function* () {
            clearInterval(EstatisticasController.insertDelay);
            EstatisticasController.insertDelay = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                var alteracao = {};
                switch (true) {
                    case input.classList.contains("meta-kcal-input"):
                        alteracao = { "metaCalorias": Number(input.value) };
                        break;
                    case input.classList.contains("meta-prots-input"):
                        alteracao = { "metaProteinas": Number(input.value) };
                        break;
                    case input.classList.contains("meta-carbs-input"):
                        alteracao = { "metaCarboidratos": Number(input.value) };
                        break;
                    case input.classList.contains("meta-gords-input"):
                        alteracao = { "metaGorduras": Number(input.value) };
                        break;
                }
                try {
                    var request = fetch(`${backend}/metas/${diaObjeto.usuario}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "Application/json"
                        },
                        body: JSON.stringify(alteracao)
                    });
                    yield NutryoFetch.nutryo.fetchMetas(diaObjeto.usuario);
                    var consumo = yield this.calculaEstatisticas();
                    this.preencheEstatisticasConsumo(consumo);
                    var metas = this.retornaMetas(this.periodoSelecionado);
                    this.preencheEstatisticasMetas(metas);
                }
                catch (err) {
                    console.log(err);
                }
                clearInterval(EstatisticasController.insertDelay);
            }), 650);
        });
    }
}
export default EstatisticasController;
