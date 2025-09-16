import NutryoFetch from "../utils/nutryoFetch.js";
import { backend } from "../utils/connection.js"
import CalendarioController from "./calendarioController.js";
import EstatisticasView from "../views/estatisticasView.js";

class EstatisticasController {
    janelaEstatisticas: HTMLElement;
    botaoAcessarEstatisticas: HTMLElement;
    botaoFecharEstatisticas: HTMLElement;

    caloriasConsumidasElemento: HTMLElement;
    proteinasConsumidasElemento: HTMLElement;
    carboidratosConsumidasElemento: HTMLElement;
    gordurasConsumidasElemento: HTMLElement;

    caloriasMetaElemento: HTMLElement;
    proteinasMetaElemento: HTMLElement;
    carboidratosMetaElemento: HTMLElement;
    gordurasMetaElemento: HTMLElement;

    porcentagemCalorias: HTMLElement;
    porcentagemProteinas: HTMLElement;
    porcentagemCarboidratos: HTMLElement;
    porcentagemGorduras: HTMLElement;

    statsDiaElemento: HTMLElement;
    statsSemanaElemento: HTMLElement;
    statsTotalElemento: HTMLElement;

    periodoSelecionado: String

    estatisticasView: EstatisticasView;

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
        this.janelaEstatisticas = document.querySelector(".janela-estatisticas") as HTMLElement;

        // Valores de consumo
        this.caloriasConsumidasElemento = document.querySelector(".info-consumo-kcal") as HTMLElement
        this.proteinasConsumidasElemento = document.querySelector(".info-consumo-prots") as HTMLElement
        this.carboidratosConsumidasElemento = document.querySelector(".info-consumo-carbs") as HTMLElement
        this.gordurasConsumidasElemento = document.querySelector(".info-consumo-gords") as HTMLElement

        // Valores de meta
        this.caloriasMetaElemento = document.querySelector(".info-meta-kcal") as HTMLElement
        this.proteinasMetaElemento = document.querySelector(".info-meta-prots") as HTMLElement
        this.carboidratosMetaElemento = document.querySelector(".info-meta-carbs") as HTMLElement
        this.gordurasMetaElemento = document.querySelector(".info-meta-gords") as HTMLElement

        // Barras de progresso
        this.porcentagemCalorias = document.querySelector(".kcal-progress") as HTMLElement
        this.porcentagemProteinas = document.querySelector(".prot-progress") as HTMLElement
        this.porcentagemCarboidratos = document.querySelector(".carbs-progress") as HTMLElement
        this.porcentagemGorduras = document.querySelector(".gords-progress") as HTMLElement

        // Navegação (tipos de periodo)
        this.statsDiaElemento = document.querySelector(".estatisticas-hoje") as HTMLElement
        this.statsSemanaElemento = document.querySelector(".estatisticas-semana") as HTMLElement
        this.statsTotalElemento = document.querySelector(".estatisticas-totais") as HTMLElement

        // Botão no aside para acessar janela de estatísticas
        this.botaoAcessarEstatisticas = document.querySelector(".estatisticas-ico") as HTMLElement

        // Botão para fechar a janela de estatísticas
        this.botaoFecharEstatisticas = document.querySelector(".janela-estatisticas-close") as HTMLElement
    }



    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por adicionar eventos de click aos elementos relacionados a janela de estatísticas

    adicionaEventosDeClick() {

        // Botão de acesso à janela de estatísticas → abre janela de estatísticas
        this.botaoAcessarEstatisticas.addEventListener("click", () => {

            // Chama método para preencher as estatísticas com os dados obtidos das refeições do período selecionado (Inicializa como dia atual)
            var dados = this.calculaEstatisticas()
            this.preencheEstatisticas(dados)

            // Mostra janela de estatísticas
            this.janelaEstatisticas.style.display = "initial"
        })

        // Botão de fechamento da janela de estatísticas → fecha janela de estatísticas
        this.botaoFecharEstatisticas.addEventListener("click", () => {
            // Esconde janela de estatísticas
            this.janelaEstatisticas.style.display = "none"
        })
    }


    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por calcular estatísticas a partir do período selecionado (hoje, semanal, total)

    calculaEstatisticas() {

        // Salva na variavel objetos de DIA do usuário conectado
        var diasSalvos = NutryoFetch.objects

        // Salva na variavel as metas nutricionais do usuário (calorias, proteinas, carboidratos e gorduras)
        var metas = this.retornaMetas()

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
                        console.log(alimento)

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

    retornaMetas() {
        // Retorna metas do usuário
        return {
            "metaCalorias": Number(this.caloriasMetaElemento.textContent.trim().replace(".", "").split(" ")[0]),
            "metaProteinas": Number(this.proteinasConsumidasElemento.textContent.trim().replace(".", "").split(" ")[0]),
            "metaCarboidratos": Number(this.carboidratosMetaElemento.textContent.trim().replace(".", "").split(" ")[0]),
            "metaGorduras": Number(this.gordurasMetaElemento.textContent.trim().replace(".", "").split(" ")[0])
        }
    }


    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por preencher informações de estatística na página (Valores de consumo e porcentagem de conclusão)

    preencheEstatisticas(dados: any) {

        // Calorias
        this.caloriasConsumidasElemento.textContent = `${dados.caloriasTotais.toFixed(0)} kcal`
        this.porcentagemCalorias.style.width = dados.porcentagemCalorias + "%";

        // Proteinas
        this.proteinasConsumidasElemento.textContent = `${dados.proteinasTotais.toFixed(0)} g`
        this.porcentagemProteinas.style.width = dados.porcentagemProteinas + "%"

        // Carboidratos
        this.carboidratosConsumidasElemento.textContent = `${dados.carboidratosTotais.toFixed(0)} g`
        this.porcentagemCarboidratos.style.width = dados.porcentagemCarboidratos + "%"

        // Gorduras
        this.gordurasConsumidasElemento.textContent = `${dados.gordurasTotais.toFixed(0)} g`
        this.porcentagemGorduras.style.width = dados.porcentagemCalorias + "%"
    }
}

export default EstatisticasController