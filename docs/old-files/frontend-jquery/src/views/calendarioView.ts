import { getLeadingCommentRanges } from "typescript";
import CalendarioController from "../controllers/calendarioController.js";
import diaObjeto from "../utils/diaObjeto.js";
import NutryoFetch from "../utils/nutryoFetch.js";

declare var $: any;

class CalendarioView {
    mesAtual: number;
    diaAtual: number;
    diaAtualSemana: number;
    posicaoDoPrimeiroDiaDoMes: any;
    anoAtual: number;

    constructor(data: Date) {
        // Inicializa e atribui valores de data aos atributos da classe
        const dataLocal = new Date(data)
        this.mesAtual = dataLocal.getMonth() + 1;
        this.diaAtual = dataLocal.getDate();
        this.diaAtualSemana = dataLocal.getDay()
        this.anoAtual = dataLocal.getFullYear()
        this.posicaoDoPrimeiroDiaDoMes = new Date(this.anoAtual, this.mesAtual - 1, 1).getDay()
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por criar elementos de dia do calendario, totalizando 42 dias
    criarElementos() {
        // Inicializa elemento dia a ser inserido no calendario
        var dia: string = '<a class="dia"></a>';
        // Cria 42 elementos (um pra cada casa do calendário)
        for (let i = 0; i <= 41; i++) {
            $(".calendario-corpo").append(dia);
        }
        // Chama método para adicionar corretamente as datas referente ao mes sendo mostrado
        this.adicionaDatas("atual");
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por adicionar datas aos elementos de dia, referentes ao mes sendo mostrado
    adicionaDatas(tipo?: string) {

        // Armazena dados de mes e ano nas variaveis:
        let mes = this.mesAtual
        let ano = this.anoAtual

        // Retorna quantos dias há no mes
        function qtdDiasNoMes(tipo: string): number {

            // Switch responsável por gerar números nas lacunas restantes (Anterior e posterior ao mes atual sendo processado)
            switch (tipo) {
                case "atual":
                    break;
                case "anterior":
                    // Reduz o mes em 1, ao chegar em janeiro (1), volta para dezembro (12)
                    mes > 1 ? mes -= 1 : mes = 12;
                    break;
                case "proximo":
                    // Aumenta o mes em 1, ao chegar em dezembro (12), volta para janeiro (1)
                    mes < 12 ? mes++ : mes = 1;
                    break;
            }

            // Sessão resposável por retornar quantos dias tem no mês
            // Fevereiro
            if (mes === 2) {
                // Se for ano bissexto
                if (ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0)) {
                    return 29;
                }
                // Se não for ano bissexto
                else {
                    return 28;
                }
            }

            // Meses com 30 dias
            else if (mes === 4 || mes === 6 || mes === 9 || mes === 11) {
                return 30;
            }

            // Meses com 31 dias
            else {
                return 31;
            }
        }

        // Armazena dado da posicao do primeiro dia do mes atual sendo processado
        var posicaoDoPrimeiroDiaDoMes: number = this.posicaoDoPrimeiroDiaDoMes;

        // Armazena dia atual em diaDeHoje
        var diaDeHoje: number = this.diaAtual;

        // Lista de elementos de dia do DOM
        var elementosDia: NodeListOf<Element> = document.querySelectorAll(".dia");

        // Função responsável por adicionar números aos elementos de dias
        function adicionaAosElementos(quantidadeDeDias: number) {

            // Limpa textos e classes de estilização de todos os campos
            for (let i = 0; i <= elementosDia.length - 1; i++) {
                elementosDia[i].textContent = ''
                elementosDia[i].classList.remove("mesAnterior")
                elementosDia[i].classList.remove("mesAtual")
                elementosDia[i].classList.remove("mesSeguinte")
                elementosDia[i].classList.remove("diaSelecionado")
                elementosDia[i].classList.remove("diaAtual")
            }

            // Inicializa contadador de dias
            var diaImpresso: number = 1;

            // Loop para adicionar numeros aos elementos DOM
            for (let i = posicaoDoPrimeiroDiaDoMes; i <= elementosDia.length - 1; i++) {

                // Atribui estilização especial para o dia atual
                if (diaImpresso == diaDeHoje) {
                    elementosDia[i].classList.add("diaAtual")
                }

                // Trecho responsável por marcar e marcar os dias do mes atual sendo processado
                if (diaImpresso >= 1 && diaImpresso <= quantidadeDeDias) {
                    elementosDia[i].textContent = String(diaImpresso)
                    elementosDia[i].classList.add("mesAtual")
                }

                // Trecho reponsável por zerar o contador e preparar para marcar e marcar dias do mes seguinte
                if (diaImpresso === quantidadeDeDias)
                    diaImpresso = 0

                // Trecho responsável por marcar e marcar dias do mês seguinte
                if (i > quantidadeDeDias + posicaoDoPrimeiroDiaDoMes - 1) {
                    elementosDia[i].classList.remove("mesAtual")
                    elementosDia[i].classList.add("mesSeguinte")
                }

                // Incrementa contador de dias a serem impressos
                diaImpresso++
            }

            // Processamento do mês anterior:
            // Primeiro armazena a quantidade de dias do mês anterior nessa variavel
            let qtdDiasMesAnterior = qtdDiasNoMes("anterior")

            // Depois decrementa dia por dia adicionando o dia no elemento DOM correto referente aos dias do mês anterior
            for (let i = posicaoDoPrimeiroDiaDoMes - 1; i >= 0; i--) {
                elementosDia[i].textContent = String(qtdDiasMesAnterior)
                elementosDia[i].classList.add("mesAnterior")
                qtdDiasMesAnterior--
            }
        }

        // Por fim, chama as funções para iniciar o processamento
        adicionaAosElementos(qtdDiasNoMes("atual"))
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por adicionar estilização a dias do calendário que possuem anotações feitas
    static async adicionarEfeitosVisuais(mesAtual?: number, anoAtual?: number) {

        // Primeiro abre uma requisição, só executa o resto do método quando houverem dados
        await NutryoFetch.nutryo.fetchDias(diaObjeto.usuario)

        // Pega todos os elementos dia do calendário
        var elementosDia = document.querySelectorAll(".dia")

        // Primeiro reinicia a estilização de dias com anotação
        for (let i = 0; i <= elementosDia.length - 1; i++) {
            elementosDia[i].classList.remove("diaComAnotacao")
        }

        // Loop para executar sob todos os dias do calendário
        for (let i = 0; i <= elementosDia.length - 1; i++) {

            // O dia é o texto do dia do calendario
            var dia = elementosDia[i].textContent;

            // Mes pode ser passado como parâmetro, se não, pega a partir da data selecionada
            var mes = mesAtual ? mesAtual : CalendarioController.paginaMes
            elementosDia[i].classList.contains("mesSeguinte") ? mes += 1 : null
            elementosDia[i].classList.contains("mesAnterior") ? mes -= 1 : null

            // Ano pode ser passado como parâmetro, se não, pega a partir da data selecionada
            var ano = anoAtual ? anoAtual : CalendarioController.dataSelecionada.split("-")[2]
            // console.log(`${dia} / ${mes} / ${ano}`)

            // String de busca (passada como parametro para retornar refeições de um dia)
            var stringBusca = `${dia}-${String(mes)}-${String(ano)}`

            // Faz busca por refeições do dia atual do loop nos objetos locais
            var busca = NutryoFetch.retornaRefeicoesDoDia(stringBusca)

            // Se houver item nos objetos locais
            if (busca)
                // Primeiro verifica se não está vazio
                if (busca.length > 0) {
                    // console.log("↑ possui!")
                    // Se não estiver vazio, adiciona estilização
                    elementosDia[i].classList.add("diaComAnotacao")
                }
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por alterar visualmente a navegação (nome do mês sendo mostrado)
    atualizaHeader() {
        // Elemento label
        var label: Element = document.querySelector(".mes-ano-label") as Element

        // Array com nome dos meses
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        // String
        const mesString: string = meses[this.mesAtual - 1];

        // Atribui string ao textcontent do elemento label
        label.textContent = `${mesString} / ${this.anoAtual}`
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por retornar a data selecionada pelo usuário
    retornaDataSelecionada() {
        // Seleciona todos os elementos de dia do calendário
        var elementosDia: NodeListOf<Element> = document.querySelectorAll(".dia")

        // @Dia
        // Primeiro inicializa diaSelecionado
        var elementoDiaSelecionado: Element | null = null;

        // E marca o dia atual
        var diaSelecionado: number = this.diaAtual;

        // Depois armazena o dia selecionado na variavel
        for (let i = 0; i < 42; i++) {
            if (elementosDia[i].classList.contains("diaSelecionado")) {
                diaSelecionado = Number(elementosDia[i].textContent);
                elementoDiaSelecionado = elementosDia[i];
            }
        }

        // @Mes
        // Inicializa mesSelecionado
        var mesSelecionado: number = this.mesAtual;

        if (elementoDiaSelecionado)
            // Se o dia selecionado pertence ao mes anterior, o mes selecionado é mes - 1
            if (elementoDiaSelecionado.classList.contains("mesAnterior")) {
                mesSelecionado = this.mesAtual - 1 < 1 ? 12 : this.mesAtual - 1
            }
            // Se o dia selecionado pertence ao mes seguinte, o mes selecionado é mes + 1
            else if (elementoDiaSelecionado.classList.contains("mesSeguinte")) {
                mesSelecionado = this.mesAtual + 1 > 12 ? 1 : this.mesAtual + 1
            }
            // Se for do mes atual, mantém igual
            else {
                mesSelecionado = this.mesAtual
            }

        // Retorna valores selecionados
        return {
            "dia": Number(diaSelecionado),
            "mes": mesSelecionado,
            "ano": this.anoAtual

        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por navegar no calendário (voltar e avançar meses) 
    navegar(direcao: string) {
        switch (direcao) {
            case "frente":
                this.mesAtual < 12 ? this.mesAtual++ : (this.mesAtual = 1, this.anoAtual++)
                break
            case "tras":
                this.mesAtual > 1 ? this.mesAtual-- : (this.mesAtual = 12, this.anoAtual--)
                break
        }
        // Marca a página atual do calendário (referente ao mês atual sendo mostrado)
        CalendarioController.paginaMes = this.mesAtual
    
        // Essa parte marca a posição da semana (0-6) do dia primeiro do mês navegado
        this.posicaoDoPrimeiroDiaDoMes = new Date(this.anoAtual, this.mesAtual - 1, 1).getDay()

        // Chama método para adicionar datas do novo mês navegado
        this.adicionaDatas()

        // Chama método para atualizar o nome do mês no label
        this.atualizaHeader()

        // Chama método para estilizar dias com anotação
        CalendarioView.adicionarEfeitosVisuais(this.mesAtual, this.anoAtual)
    }
}
// Exporta view para o controlador
export default CalendarioView;