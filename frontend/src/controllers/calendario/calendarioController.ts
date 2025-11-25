/**
 * Controlador do Calendário
 * 
 * Gerencia:
 * - Estado do calendário (mês, ano, dia selecionado)
 * - Navegação entre meses
 * - Geração do array de dias para renderização
 * - Data selecionada formatada
 */

class CalendarioController {

    // ================================================
    // ESTADOS DO CALENDÁRIO
    // ================================================

    // Data atual do sistema
    static mesAtual: number = new Date().getMonth();
    static anoAtual: number = new Date().getFullYear();
    static diaAtual: number = new Date().getDate();

    // Data selecionada pelo usuário no calendário
    static mesSelecionado: number = CalendarioController.mesAtual;
    static anoSelecionado: number = CalendarioController.anoAtual;
    static diaSelecionado: number = CalendarioController.diaAtual;

    // Data formatada como string (formato: DD-MM-AAAA)
    static dataSelecionada: string =
        `${CalendarioController.diaSelecionado}-${(CalendarioController.mesSelecionado + 1)}-${CalendarioController.anoSelecionado}`;

    // Array com nomes dos meses em português
    static meses: string[] = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Nome do mês atualmente selecionado
    static mesStringAtual: string = CalendarioController.meses[CalendarioController.mesSelecionado];

    // ================================================
    // NAVEGAÇÃO ENTRE MESES
    // ================================================

    /**
     * Navega entre meses do calendário
     * @param direcao - "anterior" ou "proximo"
     * @returns Array de dias do novo mês selecionado
     */
    static navegarMes(direcao: "anterior" | "proximo") {
        switch (direcao) {
            // Navegar para mês anterior
            case "anterior":
                var anoSelecionado: number = CalendarioController.anoSelecionado;
                var mesSelecionado: number = CalendarioController.mesSelecionado;

                // Ajusta mês e ano (volta um ano se estiver em janeiro)
                CalendarioController.anoSelecionado =
                    mesSelecionado - 1 < 0 ?
                        anoSelecionado - 1 :
                        anoSelecionado;

                CalendarioController.mesSelecionado =
                    mesSelecionado - 1 < 0 ?
                        11 : // Dezembro
                        mesSelecionado - 1;

                CalendarioController.mesStringAtual =
                    CalendarioController.meses[CalendarioController.mesSelecionado];

                // Retorna array de dias do novo mês
                return CalendarioController.gerarArrayDias(
                    CalendarioController.mesSelecionado,
                    CalendarioController.anoSelecionado);

            // Navegar para mês seguinte
            case "proximo":

                var anoSelecionado: number = CalendarioController.anoSelecionado;
                var mesSelecionado: number = CalendarioController.mesSelecionado;

                // Ajusta mês e ano (avança um ano se estiver em dezembro)
                CalendarioController.mesSelecionado =
                    mesSelecionado + 1 > 11 ?
                        0 : // Janeiro
                        mesSelecionado + 1;

                CalendarioController.anoSelecionado =
                    mesSelecionado + 1 > 11 ?
                        anoSelecionado + 1 :
                        anoSelecionado;

                CalendarioController.mesStringAtual =
                    CalendarioController.meses[CalendarioController.mesSelecionado];

                // Retorna array de dias do novo mês
                return CalendarioController.gerarArrayDias(
                    CalendarioController.mesSelecionado,
                    CalendarioController.anoSelecionado);
        }
    }

    // ================================================
    // GERAÇÃO DO CALENDÁRIO
    // ================================================

    /**
     * Gera array de dias para renderização do calendário
     * 
     * Retorna 42 dias (6 semanas) incluindo:
     * - Dias finais do mês anterior
     * - Dias do mês atual
     * - Dias iniciais do mês seguinte
     * 
     * @param mes - Mês a ser gerado (0-11)
     * @param ano - Ano a ser gerado
     * @returns Array de objetos com dia, índice e tipo
     */
    static gerarArrayDias(mes: number, ano: number) {

        /**
         * Retorna quantidade de dias em um mês específico
         * @param mes - Mês (0-11)
         * @param ano - Ano
         * @returns Número de dias no mês
         */
        function retornaDiasNoMes(mes: number, ano: number): number {
            return new Date(ano, mes + 1, 0).getDate();
        }

        // Quantidade de dias no mês atual
        const qtdDiasMes: number = retornaDiasNoMes(mes, ano)

        // Posição do primeiro dia do mês na semana (0=Domingo, 1=Segunda, ...)
        const posicaoPrimeiroDiaMes: number = new Date(ano, mes, 1).getDay();

        // Quantidade de dias do mês anterior (para preencher início do calendário)
        const mesAnterior: number = mes - 1 < 0 ? 11 : mes - 1;
        const qtdDiasMesAnterior: number = retornaDiasNoMes(mesAnterior, ano);

        // Array que conterá os 42 dias do calendário
        var diasArray: object[] = [];

        // Contador de dias do mês atual
        var diaContador: number = 1;
        
        // Preenche o array com 42 dias (6 semanas completas)
        for (let i = 0; i < 42; i++) {

            // Dias do mês anterior (preenchimento inicial)
            if (i < posicaoPrimeiroDiaMes) {
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

            // Dias do próximo mês (preenchimento final)
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