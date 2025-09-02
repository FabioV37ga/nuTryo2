class CalendarioView {
    constructor() {
        const data = new Date();
        this.mesAtual = data.getMonth() + 1;
        this.diaAtual = data.getDate();
        this.diaAtualSemana = data.getDay();
        this.anoAtual = data.getFullYear();
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
        var elementosDia = document.querySelectorAll(".dia");
        function adicionaAosElementos(quantidadeDeDias) {
            for (let i = 0; i <= elementosDia.length - 1; i++) {
                elementosDia[i].textContent = '';
                elementosDia[i].classList.remove("mesAnterior");
                elementosDia[i].classList.remove("mesAtual");
                elementosDia[i].classList.remove("mesSeguinte");
            }
            var diaImpresso = 1;
            for (let i = posicaoDoPrimeiroDiaDoMes; i <= elementosDia.length - 1; i++) {
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
}
export default CalendarioView;
