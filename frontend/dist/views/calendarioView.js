class CalendarioView {
    constructor(data) {
        const dataLocal = new Date(data);
        this.mesAtual = dataLocal.getMonth() + 1;
        this.diaAtual = dataLocal.getDate();
        this.diaAtualSemana = dataLocal.getDay();
        this.anoAtual = dataLocal.getFullYear();
        this.posicaoDoPrimeiroDiaDoMes = new Date(this.anoAtual, this.mesAtual - 1, 1).getDay();
    }
    criarElementos() {
        var dia = '<a class="dia"></a>';
        for (let i = 0; i <= 41; i++) {
            $(".calendario-corpo").append(dia);
        }
        this.adicionaDatas("atual");
    }
    adicionaDatas(tipo) {
        console.log(`${this.diaAtual}/${this.mesAtual}`);
        let mes = this.mesAtual;
        let ano = this.anoAtual;
        function qtdDiasNoMes(tipo) {
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
            if (mes === 2) {
                if (ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0)) {
                    return 29;
                }
                else {
                    return 28;
                }
            }
            else if (mes === 4 || mes === 6 || mes === 9 || mes === 11) {
                return 30;
            }
            else {
                return 31;
            }
            return 0;
        }
        var posicaoDoPrimeiroDiaDoMes = this.posicaoDoPrimeiroDiaDoMes;
        var diaDeHoje = this.diaAtual;
        var elementosDia = document.querySelectorAll(".dia");
        function adicionaAosElementos(quantidadeDeDias) {
            for (let i = 0; i <= elementosDia.length - 1; i++) {
                elementosDia[i].textContent = '';
                elementosDia[i].classList.remove("mesAnterior");
                elementosDia[i].classList.remove("mesAtual");
                elementosDia[i].classList.remove("mesSeguinte");
                elementosDia[i].classList.remove("diaSelecionado");
                elementosDia[i].classList.remove("diaAtual");
            }
            var diaImpresso = 1;
            for (let i = posicaoDoPrimeiroDiaDoMes; i <= elementosDia.length - 1; i++) {
                if (diaImpresso == diaDeHoje) {
                    elementosDia[i].classList.add("diaAtual");
                }
                if (diaImpresso >= 1 && diaImpresso <= quantidadeDeDias) {
                    elementosDia[i].textContent = String(diaImpresso);
                    elementosDia[i].classList.add("mesAtual");
                }
                if (diaImpresso === quantidadeDeDias)
                    diaImpresso = 0;
                if (i > quantidadeDeDias) {
                    elementosDia[i].classList.remove("mesAtual");
                    elementosDia[i].classList.add("mesSeguinte");
                }
                diaImpresso++;
            }
            let qtdDiasMesAnterior = qtdDiasNoMes("anterior");
            for (let i = posicaoDoPrimeiroDiaDoMes - 1; i >= 0; i--) {
                elementosDia[i].textContent = String(qtdDiasMesAnterior);
                elementosDia[i].classList.add("mesAnterior");
                qtdDiasMesAnterior--;
            }
        }
        adicionaAosElementos(qtdDiasNoMes("atual"));
    }
    atualizaHeader() {
        var label = document.querySelector(".mes-ano-label");
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        const mesString = meses[this.mesAtual - 1];
        label.textContent = `${mesString} / ${this.anoAtual}`;
    }
    retornaDataSelecionada() {
        var elementosDia = document.querySelectorAll(".dia");
        var elementoDiaSelecionado = null;
        var diaSelecionado = this.diaAtual;
        for (let i = 0; i < 42; i++) {
            if (elementosDia[i].classList.contains("diaSelecionado")) {
                diaSelecionado = Number(elementosDia[i].textContent);
                elementoDiaSelecionado = elementosDia[i];
            }
        }
        var mesSelecionado = this.mesAtual;
        if (elementoDiaSelecionado)
            if (elementoDiaSelecionado.classList.contains("mesAnterior")) {
                mesSelecionado = this.mesAtual - 1 < 1 ? 12 : this.mesAtual - 1;
            }
            else if (elementoDiaSelecionado.classList.contains("mesSeguinte")) {
                mesSelecionado = this.mesAtual + 1 > 12 ? 1 : this.mesAtual + 1;
            }
            else {
                mesSelecionado = this.mesAtual;
            }
        return {
            "dia": Number(diaSelecionado),
            "mes": mesSelecionado,
            "ano": this.anoAtual
        };
    }
    navegar(direcao) {
        switch (direcao) {
            case "frente":
                this.mesAtual < 12 ? this.mesAtual++ : (this.mesAtual = 1, this.anoAtual++);
                break;
            case "tras":
                this.mesAtual > 1 ? this.mesAtual-- : (this.mesAtual = 12, this.anoAtual--);
                break;
        }
        this.posicaoDoPrimeiroDiaDoMes = new Date(this.anoAtual, this.mesAtual - 1, 1).getDay();
        this.adicionaDatas();
        this.atualizaHeader();
        console.log(`${this.mesAtual}/${this.anoAtual}`);
    }
}
export default CalendarioView;
