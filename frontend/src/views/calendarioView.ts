declare var $: any;

class CalendarioView {
    mesAtual: number;
    diaAtual: number;
    diaAtualSemana: number;
    posicaoDoPrimeiroDiaDoMes: any;
    anoAtual: number;

    constructor(data: Date) {
        const dataLocal = new Date(data)
        this.mesAtual = dataLocal.getMonth() + 1;
        // this.mesAtual = 1;
        this.diaAtual = dataLocal.getDate();
        this.diaAtualSemana = dataLocal.getDay()
        this.anoAtual = dataLocal.getFullYear()
        // this.anoAtual = 2003;
        this.posicaoDoPrimeiroDiaDoMes = new Date(this.anoAtual, this.mesAtual - 1, 1).getDay()
    }

    criarElementos() {
        // Inicializa elemento dia a ser inserido no calendario
        var dia: string = '<a class="dia"></a>';
        // Cria 42 elementos (um pra cada casa do calendário)
        for (let i = 0; i <= 41; i++) {
            $(".calendario-corpo").append(dia);
        }

        this.adicionaDatas("atual");
    }

    adicionaDatas(tipo?: string) {
        // Mostra data atual sendo processada
        // console.log(`${this.diaAtual}/${this.mesAtual}`)

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
                    mes > 1 ? mes -= 1 : mes = 12;
                    break;
                case "proximo":
                    mes < 12 ? mes++ : mes = 1;
                    break;
            }

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
            return 0
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
                if (i  > quantidadeDeDias + posicaoDoPrimeiroDiaDoMes - 1) {
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

    atualizaHeader() {
        var label:Element = document.querySelector(".mes-ano-label") as Element
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        const mesString:string = meses[this.mesAtual - 1];

        label.textContent = `${mesString} / ${this.anoAtual}`
    }

    retornaDataSelecionada() {
        // Faz tratamento para seleção precisa
        var elementosDia: NodeListOf<Element> = document.querySelectorAll(".dia")

        // Dia
        // Primeiro inicializa diaSelecionado
        var elementoDiaSelecionado: Element | null = null;
        var diaSelecionado: number = this.diaAtual;
        // Depois armazena o dia selecionado na variavel
        for (let i = 0; i < 42; i++) {
            if (elementosDia[i].classList.contains("diaSelecionado")) {
                diaSelecionado = Number(elementosDia[i].textContent);
                elementoDiaSelecionado = elementosDia[i];
            }
        }

        // console.log(elementoDiaSelecionado)

        // Mes
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

        return {
            "dia": Number(diaSelecionado),
            "mes": mesSelecionado,
            "ano": this.anoAtual

        }
    }

    navegar(direcao: string) {
        switch (direcao) {
            case "frente":
                this.mesAtual < 12 ? this.mesAtual++ : (this.mesAtual = 1, this.anoAtual++)
                break
            case "tras":
                this.mesAtual > 1 ? this.mesAtual-- : (this.mesAtual = 12, this.anoAtual--)
                break
        }
        this.posicaoDoPrimeiroDiaDoMes = new Date(this.anoAtual, this.mesAtual - 1, 1).getDay()
        this.adicionaDatas()
        this.atualizaHeader()
        console.log(`${this.mesAtual}/${this.anoAtual}`)

    }
}
// Exporta view para o controlador
export default CalendarioView;