class CalendarioController {

    // Estados estáticos para mês e ano atuais e selecionados
    static mesAtual: number = new Date().getMonth();
    static anoAtual: number = new Date().getFullYear();
    static diaAtual: number = new Date().getDate();


    // Estados referentes ao mês e ano selecionados no calendário
    static mesSelecionado: number = CalendarioController.mesAtual;
    static anoSelecionado: number = CalendarioController.anoAtual;
    static diaSelecionado: number = CalendarioController.diaAtual;

    static dataSelecionada: string =
        `${CalendarioController.diaSelecionado}-${(CalendarioController.mesSelecionado + 1)}-${CalendarioController.anoSelecionado}`;

    // Array com nomes dos meses
    static meses: string[] = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // String do mês selecionado
    static mesStringAtual: string = CalendarioController.meses[CalendarioController.mesSelecionado];

    // Função para navegar entre meses
    static navegarMes(direcao: "anterior" | "proximo") {
        switch (direcao) {
            // Navegar para mês anterior
            case "anterior":
                var anoSelecionado: number = CalendarioController.anoSelecionado;
                var mesSelecionado: number = CalendarioController.mesSelecionado;

                // Ajusta mês e ano selecionados
                CalendarioController.anoSelecionado =
                    mesSelecionado - 1 < 0 ?
                        anoSelecionado - 1 :
                        anoSelecionado;

                CalendarioController.mesSelecionado =
                    mesSelecionado - 1 < 0 ?
                        11 :
                        mesSelecionado - 1;

                CalendarioController.mesStringAtual =
                    CalendarioController.meses[CalendarioController.mesSelecionado];


                // Retorna array de dias do novo mês selecionado
                return CalendarioController.gerarArrayDias(
                    CalendarioController.mesSelecionado,
                    CalendarioController.anoSelecionado);

            // Navegar para mês seguinte
            case "proximo":

                var anoSelecionado: number = CalendarioController.anoSelecionado;
                var mesSelecionado: number = CalendarioController.mesSelecionado;

                // Ajusta mês e ano selecionados
                CalendarioController.mesSelecionado =
                    mesSelecionado + 1 > 11 ?
                        0 :
                        mesSelecionado + 1;

                CalendarioController.anoSelecionado =
                    mesSelecionado + 1 > 11 ?
                        anoSelecionado + 1 :
                        anoSelecionado;

                CalendarioController.mesStringAtual =
                    CalendarioController.meses[CalendarioController.mesSelecionado];

                // Retorna array de dias do novo mês selecionado
                return CalendarioController.gerarArrayDias(
                    CalendarioController.mesSelecionado,
                    CalendarioController.anoSelecionado);
        }
    }

    // Função para gerar array de dias do mês
    static gerarArrayDias(mes: number, ano: number) {

        // Função para retornar a quantidade de dias em um mês
        function retornaDiasNoMes(mes: number, ano: number): number {
            return new Date(ano, mes + 1, 0).getDate();
        }

        // Quantidade de dias no mês
        const qtdDiasMes: number = retornaDiasNoMes(mes, ano)

        // Posição do primeiro dia do mês na semana
        const posicaoPrimeiroDiaMes: number = new Date(ano, mes, 1).getDay();

        // Quantidade de dias do mês anterior
        const mesAnterior: number = mes - 1 < 0 ? 11 : mes - 1;
        const qtdDiasMesAnterior: number = retornaDiasNoMes(mesAnterior, ano);

        // Array de dias para preencher o calendário
        // var diasArray: [number, number, string][] = [];
        var diasArray: object[] = [];

        // Preenchendo o array com os dias
        var diaContador: number = 1;
        for (let i = 0; i < 42; i++) {

            // Dias do mês anterior
            if (i < posicaoPrimeiroDiaMes) {
                // diasArray.push(
                //     [qtdDiasMesAnterior - (posicaoPrimeiroDiaMes - 1) + i,
                //         i,
                //         "mesAnterior"
                //     ]
                // );
                diasArray.push({
                    dia: qtdDiasMesAnterior - (posicaoPrimeiroDiaMes - 1) + i,
                    index: i,
                    tipo: "mesAnterior"
                })
            }

            // Dias do mês atual
            else if (diaContador <= qtdDiasMes) {
                diasArray.push({
                    dia: diaContador,
                    index: i,
                    tipo: "mesAtual"
                });
                diaContador++;
            }

            // Dias do próximo mês
            else {
                diasArray.push({
                    dia: diaContador - qtdDiasMes,
                    index: i,
                    tipo: "mesSeguinte"
                });
                diaContador++;
            }
        }

        console.log(diasArray)
        return diasArray
    }
}

export default CalendarioController;