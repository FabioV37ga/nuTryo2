import NutryoFetch from "../utils/nutryoFetch.js";
import { backend } from "../utils/connection.js"
import CalendarioController from "./calendarioController.js";
import EstatisticasView from "../views/estatisticasView.js";
import diaObjeto from "../utils/diaObjeto.js";

class EstatisticasController {
    static janelaEstatisticas: HTMLElement;
    static botaoAcessarEstatisticas: HTMLElement;
    static botaoFecharEstatisticas: HTMLElement;

    static caloriasConsumidasElemento: HTMLElement;
    static proteinasConsumidasElemento: HTMLElement;
    static carboidratosConsumidasElemento: HTMLElement;
    static gordurasConsumidasElemento: HTMLElement;

    static caloriasMetaElemento: HTMLFormElement;
    static proteinasMetaElemento: HTMLFormElement;
    static carboidratosMetaElemento: HTMLFormElement;
    static gordurasMetaElemento: HTMLFormElement;

    static porcentagemCalorias: HTMLElement;
    static porcentagemProteinas: HTMLElement;
    static porcentagemCarboidratos: HTMLElement;
    static porcentagemGorduras: HTMLElement;

    static statsDiaElemento: HTMLElement;
    static statsSemanaElemento: HTMLElement;
    static statsMensalElemento: HTMLElement;

    static insertDelay: any;

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
            if (NutryoFetch.objects && NutryoFetch.metas) {
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
        EstatisticasController.caloriasMetaElemento = document.querySelector(".info-meta-kcal input") as HTMLFormElement
        EstatisticasController.proteinasMetaElemento = document.querySelector(".info-meta-prots input") as HTMLFormElement
        EstatisticasController.carboidratosMetaElemento = document.querySelector(".info-meta-carbs input") as HTMLFormElement
        EstatisticasController.gordurasMetaElemento = document.querySelector(".info-meta-gords input") as HTMLFormElement

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
        EstatisticasController.botaoAcessarEstatisticas.addEventListener("click", async () => {
            // Chama método para preencher as estatísticas com os dados obtidos das refeições do período selecionado (Inicializa como dia atual)
            await NutryoFetch.nutryo.fetchMetas(diaObjeto.usuario)

            this.selecionaPeriodo("hoje");
            var dados = await this.calculaEstatisticas();
            this.preencheEstatisticasConsumo(dados);

            // Mostra janela de estatísticas
            EstatisticasController.janelaEstatisticas.style.display = "initial"
            // clearInterval(intervaloFetch)
        })

        // Botão de fechamento da janela de estatísticas → fecha janela de estatísticas
        EstatisticasController.botaoFecharEstatisticas.addEventListener("click", () => {
            // Esconde janela de estatísticas
            EstatisticasController.janelaEstatisticas.style.display = "none"
        })

        // Botões para editar as metas de consumo do usuário na janela de estatísticas
        var botoesEditarMeta = document.querySelectorAll(".meta-edit")
        // Adiciona evento nos 4 botões de edição
        for (let i = 0; i <= botoesEditarMeta.length - 1; i++) {
            botoesEditarMeta[i].addEventListener("click", (e) => {
                e.stopPropagation
                var botaoPressionado = e.currentTarget as HTMLElement
                var campoMeta = botaoPressionado.parentElement?.children[2].children[0] as HTMLElement | any

                console.log(campoMeta)
                campoMeta.disabled = false
                campoMeta.focus()
                // campoMeta.style.background = "blue"
            })
        }

        // Campos de meta
        var camposMeta = document.querySelectorAll(".informacoes-meta input")
        // Loop para adicionar nos 4 campos
        for (let i = 0; i <= camposMeta.length - 1; i++) {

            // Evento de input → envia alterações de meta pro banco
            camposMeta[i].addEventListener("input", (e) => {
                e.stopPropagation

                var campoTarget = e.currentTarget as HTMLFormElement

                this.defineMeta(campoTarget)
            })

            // Evento de blur → clicar fora do elemento desabilita a tag de input
            camposMeta[i].addEventListener("blur", (e) => {
                e.stopPropagation
                var campoTarget = e.currentTarget as any
                campoTarget.disabled = 'true'
            })
        }

        // Seletores de período -----------------------------------------------------------

        // @Hoje
        EstatisticasController.statsDiaElemento.addEventListener("click", async () => {
            this.selecionaPeriodo("hoje")
            var dados = this.calculaEstatisticas();
            this.preencheEstatisticasConsumo(dados);
        })

        // @Semanal
        EstatisticasController.statsSemanaElemento.addEventListener("click", async () => {
            this.selecionaPeriodo("semanal")
            var dados = await this.calculaEstatisticas();
            this.preencheEstatisticasConsumo(dados);
        })

        // @Mensal
        EstatisticasController.statsMensalElemento.addEventListener("click", async () => {
            this.selecionaPeriodo("mensal")
            var dados = await this.calculaEstatisticas();
            this.preencheEstatisticasConsumo(dados);
        })
    }


    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por calcular estatísticas a partir do período selecionado (hoje, semanal, mensal)

    async calculaEstatisticas() {
        await NutryoFetch.nutryo.fetchMetas(diaObjeto.usuario)

        // Salva na variavel as metas nutricionais do usuário (calorias, proteinas, carboidratos e gorduras)
        var metas = this.retornaMetas(this.periodoSelecionado as string) as any

        this.preencheEstatisticasMetas(metas)

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

                        // Chama função para somar valores das refeições
                        somaValores(alimento)
                    }
                }
                break;

            case "semanal":
                // Cria data para o dia atual
                var hoje = new Date()

                // Pega o dia da semana do dia atual
                var diaSemanaAtual = hoje.getDay()

                // Pega o dia do mês referente ao domingo dessa semana
                var domingo = new Date(hoje)
                domingo.setDate(hoje.getDate() - diaSemanaAtual)

                for (let i = 0; i <= 6; i++) {
                    // Define o dia inicial da busca como o domingo da semana relacionada
                    var diaSemana = new Date(domingo);

                    // Incrementa data até completar 7 dias (Domingo → Sábado)
                    diaSemana.setDate(diaSemana.getDate() + i)

                    // // String data (para pesquisar refeição nos objetos)
                    var stringData = `${diaSemana.getDate()}-${diaSemana.getMonth() + 1}-${diaSemana.getFullYear()}`

                    // Faz busca das refeições do dia atual do loop
                    var refeicoesDoDia = NutryoFetch.retornaRefeicoesDoDia(stringData) as any

                    // Se houverem refeições no dia...
                    if (refeicoesDoDia) {

                        // Loop para executar sobre todas as refeições
                        for (let i = 0; i <= refeicoesDoDia.length - 1; i++) {

                            // Retorna alimentos da refeição indice
                            var alimento = NutryoFetch.retornaAlimentosDaRefeicao(stringData, String(i + 1)) as any

                            // Chama função para somar valores das refeições
                            somaValores(alimento)
                        }
                    }
                }
                break;

            case "mensal":
                // Cria data para dia atual
                var dataAtual = new Date();

                // Marca o mês a ser verificado
                var mesAtual = dataAtual.getMonth()

                // Marca o ano a ser verificado
                var anoAtual = dataAtual.getFullYear()

                // Loop para executar em cada dia do mês
                for (let i = 1; i <= 31; i++) {

                    // String data (para pesquisar refeição nos objetos)
                    var stringData = `${i}-${mesAtual + 1}-${anoAtual}`

                    // Faz busca das refeições
                    var refeicoesDoDia = NutryoFetch.retornaRefeicoesDoDia(stringData) as any

                    // Se houver refeição...
                    if (refeicoesDoDia) {

                        // Loop para executar em todas as refeições
                        for (let i = 0; i <= refeicoesDoDia.length - 1; i++) {

                            // Retorna alimentos da refeição atual do loop
                            var alimento = NutryoFetch.retornaAlimentosDaRefeicao(stringData, String(i + 1)) as any

                            // Soma valores nutricionais
                            somaValores(alimento)
                        }
                    }
                }
                break;

        }
        // # Função responsável por somar valores nutricionais de um periodo para calculo de progresso
        function somaValores(alimento: any) {
            // Loop para executar sobre todos os alimentos da refeição
            for (let a = 0; a <= alimento.length - 1; a++) {
                caloriasTotais += Number(alimento[a].calorias)
                proteinasTotais += Number(alimento[a].proteinas)
                carboidratosTotais += Number(alimento[a].carboidratos)
                gordurasTotais += Number(alimento[a].gorduras)
            }
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
            "metaCalorias": Number(NutryoFetch.metas.metaCalorias),
            "metaProteinas": Number(NutryoFetch.metas.metaProteinas),
            "metaCarboidratos": Number(NutryoFetch.metas.metaCarboidratos),
            "metaGorduras": Number(NutryoFetch.metas.metaGorduras)
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
    // # Método responsável por preencher informações estatísticas de consumo na página (Valores de consumo e porcentagem de conclusão)

    preencheEstatisticasConsumo(dados: any) {

        // Calorias
        EstatisticasController.caloriasConsumidasElemento.textContent = `${dados.caloriasTotais.toFixed(0)} kcal`
        dados.porcentagemCalorias = dados.porcentagemCalorias <= 100 ? dados.porcentagemCalorias : 100
        EstatisticasController.porcentagemCalorias.style.width = dados.porcentagemCalorias + "%";

        // Proteinas
        EstatisticasController.proteinasConsumidasElemento.textContent = `${dados.proteinasTotais.toFixed(0)} g`
        dados.porcentagemProteinas = dados.porcentagemProteinas <= 100 ? dados.porcentagemProteinas : 100
        EstatisticasController.porcentagemProteinas.style.width = dados.porcentagemProteinas + "%"

        // Carboidratos
        EstatisticasController.carboidratosConsumidasElemento.textContent = `${dados.carboidratosTotais.toFixed(0)} g`
        dados.porcentagemCarboidratos = dados.porcentagemCarboidratos <= 100 ? dados.porcentagemCarboidratos : 100
        EstatisticasController.porcentagemCarboidratos.style.width = dados.porcentagemCarboidratos + "%"

        // Gorduras
        EstatisticasController.gordurasConsumidasElemento.textContent = `${dados.gordurasTotais.toFixed(0)} g`
        dados.porcentagemGorduras = dados.porcentagemGorduras <= 100 ? dados.porcentagemGorduras : 100
        EstatisticasController.porcentagemGorduras.style.width = dados.porcentagemGorduras + "%"
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por preencher informações estatísticas de meta (Valores a serem atingidos, únicos por usuário)
    preencheEstatisticasMetas(metas: any) {
        // Calorias
        EstatisticasController.caloriasMetaElemento.value = metas.metaCalorias
        EstatisticasController.caloriasMetaElemento.style.width = metas.metaCalorias.toString().split("").length * 16 + "px"

        // Proteinas
        EstatisticasController.proteinasMetaElemento.value = metas.metaProteinas
        EstatisticasController.proteinasMetaElemento.style.width = metas.metaProteinas.toString().split("").length * 16 + "px"
        // Carboidratos
        EstatisticasController.carboidratosMetaElemento.value = metas.metaCarboidratos
        EstatisticasController.carboidratosMetaElemento.style.width = metas.metaCarboidratos.toString().split("").length * 16 + "px"
        // Gorduras
        EstatisticasController.gordurasMetaElemento.value = metas.metaGorduras
        EstatisticasController.gordurasMetaElemento.style.width = metas.metaGorduras.toString().split("").length * 16 + "px"
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por selecionar o período para calculo de estatísticas
    selecionaPeriodo(periodo: string) {
        // Seleciona o período passado como parâmetro
        this.periodoSelecionado = periodo

        // Seleciona visualmente o período
        this.estatisticasView.selecionaPeriodo(periodo)
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por definir valores de meta do usuário a partir de mudanças nos campos de meta na janela de estatísticas
    async defineMeta(input: HTMLFormElement) {

        // Inicia limpando o delay de busca
        clearInterval(EstatisticasController.insertDelay)

        // Cria um delay para evitar requisições múltiplas consecutivas (delay de requisição)
        EstatisticasController.insertDelay = setInterval(async () => {

            // Inicia objeto de alteração vazio
            var alteracao: object = {}

            // Alterações nas metas de caloria
            if (input.classList.contains("meta-kcal-input")) {
                alteracao = { "metaCalorias": Number(input.value) }
            }

            // Alterações nas metas de proteinas
            else if (input.classList.contains("meta-prots-input")) {
                alteracao = { "metaProteinas": Number(input.value) }
            }

            // Alterações nas metas de carboidratos
            else if (input.classList.contains("meta-carbs-input")) {
                alteracao = { "metaCarboidratos": Number(input.value) }
            }

            // Alterações nas metas de gorduras
            else if (input.classList.contains("meta-gords-input")) {
                alteracao = { "metaGorduras": Number(input.value) }
            }

            try {
                // Inicia requisição
                var request = fetch(`${backend}/metas/${diaObjeto.usuario}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "Application/json"
                    },
                    body: JSON.stringify(alteracao)
                })

                // Depois da edição das metas no banco, retorna objeto do banco atualizado
                await NutryoFetch.nutryo.fetchMetas(diaObjeto.usuario)

                // Preenche as estatísticas de consumo com as alterações feitas pelo usuário
                var consumo = await this.calculaEstatisticas()
                this.preencheEstatisticasConsumo(consumo)

                // Preenche as estatísticas de metas com as alterações feitas pelo usuário
                var metas = this.retornaMetas(this.periodoSelecionado as string)
                this.preencheEstatisticasMetas(metas)
            } catch (err) {
                console.log(err)
            }

            // Limpa delay de requisição
            clearInterval(EstatisticasController.insertDelay)
        }, 650);


    }

}

export default EstatisticasController