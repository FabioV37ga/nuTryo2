import NutryoFetch from "../utils/nutryoFetch.js";
import { backend } from "../utils/connection.js"
import CalendarioController from "./calendarioController.js";
import EstatisticasView from "../views/estatisticasView.js";

class EstatisticasController {
    static janelaEstatisticas: HTMLElement;
    static botaoAcessarEstatisticas: HTMLElement;
    static botaoFecharEstatisticas: HTMLElement;

    static caloriasConsumidasElemento: HTMLElement;
    static proteinasConsumidasElemento: HTMLElement;
    static carboidratosConsumidasElemento: HTMLElement;
    static gordurasConsumidasElemento: HTMLElement;

    static caloriasMetaElemento: HTMLElement;
    static proteinasMetaElemento: HTMLElement;
    static carboidratosMetaElemento: HTMLElement;
    static gordurasMetaElemento: HTMLElement;

    static porcentagemCalorias: HTMLElement;
    static porcentagemProteinas: HTMLElement;
    static porcentagemCarboidratos: HTMLElement;
    static porcentagemGorduras: HTMLElement;

    static statsDiaElemento: HTMLElement;
    static statsSemanaElemento: HTMLElement;
    static statsMensalElemento: HTMLElement;

    periodoSelecionado: String

    estatisticasView: EstatisticasView = new EstatisticasView();

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Construtor

    constructor() {

        // Instância de view
        this.estatisticasView = new EstatisticasView()

        // Define o periodo selecionado para "hoje" - valor padrão
        this.periodoSelecionado = "hoje"

        // Chama método para atribuir elementos HTML aos atributos da classe
        this.defineElementos()

        // Chama método para adicionar eventos aos elementos relacionado a janela de estatísticas
        this.adicionaEventosDeClick()

        // Initervalo lógico: Só calcula as estatisticas quando a requisição por refeições no banco de dados terminar
        var intervalo = setInterval(() => {
            if (NutryoFetch.status == 1) {
                this.calculaEstatisticas()
                clearInterval(intervalo)
            }
        }, 1);
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por atribuir elementos da janela de estatísticas aos atributos da classe

    defineElementos() {

        // Janela de estatísticas
        EstatisticasController.janelaEstatisticas = document.querySelector(".janela-estatisticas") as HTMLElement;

        // Valores de consumo
        EstatisticasController.caloriasConsumidasElemento = document.querySelector(".info-consumo-kcal") as HTMLElement
        EstatisticasController.proteinasConsumidasElemento = document.querySelector(".info-consumo-prots") as HTMLElement
        EstatisticasController.carboidratosConsumidasElemento = document.querySelector(".info-consumo-carbs") as HTMLElement
        EstatisticasController.gordurasConsumidasElemento = document.querySelector(".info-consumo-gords") as HTMLElement

        // Valores de meta
        EstatisticasController.caloriasMetaElemento = document.querySelector(".info-meta-kcal") as HTMLElement
        EstatisticasController.proteinasMetaElemento = document.querySelector(".info-meta-prots") as HTMLElement
        EstatisticasController.carboidratosMetaElemento = document.querySelector(".info-meta-carbs") as HTMLElement
        EstatisticasController.gordurasMetaElemento = document.querySelector(".info-meta-gords") as HTMLElement

        // Barras de progresso
        EstatisticasController.porcentagemCalorias = document.querySelector(".kcal-progress") as HTMLElement
        EstatisticasController.porcentagemProteinas = document.querySelector(".prot-progress") as HTMLElement
        EstatisticasController.porcentagemCarboidratos = document.querySelector(".carbs-progress") as HTMLElement
        EstatisticasController.porcentagemGorduras = document.querySelector(".gords-progress") as HTMLElement

        // Navegação (tipos de periodo)
        EstatisticasController.statsDiaElemento = document.querySelector(".estatisticas-hoje") as HTMLElement
        EstatisticasController.statsSemanaElemento = document.querySelector(".estatisticas-semana") as HTMLElement
        EstatisticasController.statsMensalElemento = document.querySelector(".estatisticas-totais") as HTMLElement

        // Botão no aside para acessar janela de estatísticas
        EstatisticasController.botaoAcessarEstatisticas = document.querySelector(".estatisticas-ico") as HTMLElement

        // Botão para fechar a janela de estatísticas
        EstatisticasController.botaoFecharEstatisticas = document.querySelector(".janela-estatisticas-close") as HTMLElement
    }



    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por adicionar eventos de click aos elementos relacionados a janela de estatísticas

    adicionaEventosDeClick() {

        // Botão de acesso à janela de estatísticas → abre janela de estatísticas
        EstatisticasController.botaoAcessarEstatisticas.addEventListener("click", () => {

            // Chama método para preencher as estatísticas com os dados obtidos das refeições do período selecionado (Inicializa como dia atual)
            this.selecionaPeriodo("hoje");
            var dados = this.calculaEstatisticas();
            this.preencheEstatisticas(dados);

            // Mostra janela de estatísticas
            EstatisticasController.janelaEstatisticas.style.display = "initial"
        })

        // Botão de fechamento da janela de estatísticas → fecha janela de estatísticas
        EstatisticasController.botaoFecharEstatisticas.addEventListener("click", () => {
            // Esconde janela de estatísticas
            EstatisticasController.janelaEstatisticas.style.display = "none"
        })

        // Seletores de período -----------------------------------------------------------

        // @Hoje
        EstatisticasController.statsDiaElemento.addEventListener("click", () => {
            this.selecionaPeriodo("hoje")
            var dados = this.calculaEstatisticas();
            this.preencheEstatisticas(dados);
        })

        // @Semanal
        EstatisticasController.statsSemanaElemento.addEventListener("click", () => {
            this.selecionaPeriodo("semanal")
            var dados = this.calculaEstatisticas();
            this.preencheEstatisticas(dados);
        })

        // @Mensal
        EstatisticasController.statsMensalElemento.addEventListener("click", () => {
            this.selecionaPeriodo("mensal")
            var dados = this.calculaEstatisticas();
            this.preencheEstatisticas(dados);
        })
    }


    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por calcular estatísticas a partir do período selecionado (hoje, semanal, mensal)

    calculaEstatisticas() {

        // Salva na variavel objetos de DIA do usuário conectado
        var diasSalvos = NutryoFetch.objects

        // Salva na variavel as metas nutricionais do usuário (calorias, proteinas, carboidratos e gorduras)
        var metas = this.retornaMetas(this.periodoSelecionado as string) as any

        // Inicializa variaveis de soma total dos valores nutricionais do período selecionado
        var caloriasTotais: number = 0;
        var proteinasTotais: number = 0;
        var carboidratosTotais: number = 0;
        var gordurasTotais: number = 0;

        // Switch: Lógica diferente para cada período
        switch (this.periodoSelecionado) {
            case "hoje":
                // Inicia data como a data de hoje
                var data = new Date()

                // Formata string da data para fazer a busca nos objetos locais
                var stringData = `${data.getDate()}-${data.getMonth() + 1}-${data.getFullYear()}`

                // Retorna refeições do dia de hoje
                var refeicoes = NutryoFetch.retornaRefeicoesDoDia(stringData) as any

                // Se houverem refeições no dia de hoje...
                if (refeicoes) {

                    // Loop para executar sobre todas as refeições
                    for (let i = 0; i <= refeicoes.length - 1; i++) {

                        // Retorna alimentos da refeição indice
                        var alimento = NutryoFetch.retornaAlimentosDaRefeicao(stringData, String(i + 1)) as any

                        // Loop para executar sobre todos os alimentos da refeição
                        for (let a = 0; a <= alimento.length - 1; a++) {
                            caloriasTotais += Number(alimento[a].calorias)
                            proteinasTotais += Number(alimento[a].proteinas)
                            carboidratosTotais += Number(alimento[a].carboidratos)
                            gordurasTotais += Number(alimento[a].gorduras)
                        }
                    }
                }
                break;

            case "semanal":
                break;

            case "mensal":

                break;
        }

        // Calcula o progresso (em porcentagem) da barra de progresso de cada valor nutricional (fazendo regra de 3)
        var porcentagemCalorias = (caloriasTotais * 100) / metas.metaCalorias
        var porcentagemProteinas = (proteinasTotais * 100) / metas.metaProteinas
        var porcentagemCarboidratos = (carboidratosTotais * 100) / metas.metaCarboidratos
        var porcentagemGorduras = (gordurasTotais * 100) / metas.metaGorduras

        // Retorna valores
        return {
            // Calorias
            "caloriasTotais": caloriasTotais,
            "porcentagemCalorias": porcentagemCalorias,

            // Proteinas
            "proteinasTotais": proteinasTotais,
            "porcentagemProteinas": porcentagemProteinas,

            // Carboidratos
            "carboidratosTotais": carboidratosTotais,
            "porcentagemCarboidratos": porcentagemCarboidratos,

            // Gorduras
            "gordurasTotais": gordurasTotais,
            "porcentagemGorduras": porcentagemGorduras
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por retornar as metas definidas pelo usuário (Assumem valor padrão se o usuário não altera-las)

    retornaMetas(periodo: string) {
        // Retorna metas do usuário
        var metas = {
            "metaCalorias": Number(
                EstatisticasController.caloriasMetaElemento.textContent.
                    trim().
                    replace(".", "").
                    split(" ")[0]),
            "metaProteinas": Number(
                EstatisticasController.proteinasConsumidasElemento.textContent
                    .trim()
                    .replace(".", "")
                    .split(" ")[0]),
            "metaCarboidratos": Number(
                EstatisticasController.carboidratosMetaElemento.textContent
                    .trim()
                    .replace(".", "")
                    .split(" ")[0]),
            "metaGorduras": Number(
                EstatisticasController.gordurasMetaElemento.textContent
                    .trim()
                    .replace(".", "")
                    .split(" ")[0])
        }

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


    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por preencher informações de estatística na página (Valores de consumo e porcentagem de conclusão)

    preencheEstatisticas(dados: any) {

        // Calorias
        EstatisticasController.caloriasConsumidasElemento.textContent = `${dados.caloriasTotais.toFixed(0)} kcal`
        EstatisticasController.porcentagemCalorias.style.width = dados.porcentagemCalorias + "%";

        // Proteinas
        EstatisticasController.proteinasConsumidasElemento.textContent = `${dados.proteinasTotais.toFixed(0)} g`
        EstatisticasController.porcentagemProteinas.style.width = dados.porcentagemProteinas + "%"

        // Carboidratos
        EstatisticasController.carboidratosConsumidasElemento.textContent = `${dados.carboidratosTotais.toFixed(0)} g`
        EstatisticasController.porcentagemCarboidratos.style.width = dados.porcentagemCarboidratos + "%"

        // Gorduras
        EstatisticasController.gordurasConsumidasElemento.textContent = `${dados.gordurasTotais.toFixed(0)} g`
        EstatisticasController.porcentagemGorduras.style.width = dados.porcentagemCalorias + "%"
    }

    selecionaPeriodo(periodo: string) {
        this.periodoSelecionado = periodo

        this.estatisticasView.selecionaPeriodo(periodo)
    }
}

export default EstatisticasController