/**
 * Componente Calendário
 * 
 * Exibe um calendário mensal interativo com navegação entre meses.
 * 
 * Funcionalidades:
 * - Exibe dias do mês atual, anterior e seguinte
 * - Permite navegação entre meses (setas < >)
 * - Destaca dia selecionado
 * - Indica dias com anotações/refeições registradas
 * - Sincroniza com CalendarioController para gerenciar estado
 * - Notifica componente pai quando data é selecionada
 * - Gera objeto de dia via diaObjeto ao selecionar data
 * 
 * @component
 * @param {object} props
 * @param {function} [props.setDataDisplay] - Callback para atualizar display de data no componente pai
 */

import { useState, useEffect } from "react";

import "../../styles/calendario/calendario.css"

import CalendarioController from "../../controllers/calendario/calendarioController";
import Dia from "./dia";
import diaObjeto from "../../utils/diaObjeto";
import NutryoFetch from "../../utils/nutryoFetch";

function Calendario({ setDataDisplay, onDiaClick }: { setDataDisplay?: (data: string) => void; onDiaClick?: () => void }) {
    /**
     * Estado dos dias exibidos no calendário
     * Array contendo objetos: { dia: number, index: number, tipo: "mesAtual" | "mesAnterior" | "mesSeguinte" }
     * Inicializa com mês/ano atual
     */
    const [dias, setDias] = useState(() => {
        const dataAtual = new Date();
        return CalendarioController.gerarArrayDias(
            dataAtual.getMonth(),
            dataAtual.getFullYear()
        );
    });

    /**
     * Navega entre meses (anterior ou próximo)
     * 
     * @param {"anterior" | "proximo"} direcao - Direção da navegação
     * 
     * Atualiza CalendarioController e regenera array de dias
     */
    function navegarMes(direcao: "anterior" | "proximo") {
        const novosDias = CalendarioController.navegarMes(direcao);
        setDias(novosDias);
    }

    /**
     * Estado do dia selecionado
     * Armazena dia + mês + ano para poder restaurar ao navegar entre meses
     * Inicializa com dia atual do CalendarioController
     */
    const [diaSelecionado, setDiaSelecionado] = useState<{
        dia: number;
        mes: number;
        ano: number;
    } | null>(() => ({
        dia: CalendarioController.diaSelecionado,
        mes: CalendarioController.mesSelecionado,
        ano: CalendarioController.anoSelecionado
    }));

    /**
     * Efeito executado ao montar o componente
     * Seleciona automaticamente o dia atual ou o primeiro dia do mês
     */
    useEffect(() => {
        const diaAtualSelecionado = CalendarioController.diaSelecionado;
        const mesAtualSelecionado = CalendarioController.mesSelecionado;

        // Encontra o dia correspondente no array de dias
        const diaEncontrado = dias.find(
            (d: any) =>
                d.dia === diaAtualSelecionado &&
                d.tipo === "mesAtual" &&
                mesAtualSelecionado === CalendarioController.mesSelecionado
        );

        // Se encontrado, seleciona esse dia; caso contrário, seleciona o primeiro dia do mês atual
        const diaParaSelecionar = diaEncontrado || dias.find((d: any) => d.tipo === "mesAtual");

        if (diaParaSelecionar) {
            selecionarDia(diaParaSelecionar as { dia: number; index: number; tipo: string });
        }
    }, []);

    /**
     * Seleciona um dia no calendário
     * 
     * @param {object} dia - Objeto do dia: { dia: number, index: number, tipo: string }
     * 
     * Processo:
     * 1. Se dia pertence ao mês anterior/próximo, navega para esse mês
     * 2. Atualiza dataSelecionada no CalendarioController
     * 3. Notifica componente pai para atualizar display
     * 4. Atualiza estado local de diaSelecionado
     * 5. Gera objeto de dia via diaObjeto com dados do backend
     */
    function selecionarDia(dia: { dia: number; index: number; tipo: string }) {
        // Se o dia clicado pertence ao mês anterior, navega para esse mês
        if (dia.tipo === "mesAnterior") {
            navegarMes("anterior");
        }

        // Se o dia clicado pertence ao próximo mês, navega para esse mês
        if (dia.tipo === "mesSeguinte") {
            navegarMes("proximo");
        }

        // Atualiza o dia selecionado no controller
        const diaNum = dia.dia;
        const mesNum = CalendarioController.mesSelecionado;
        const anoNum = CalendarioController.anoSelecionado;

        // Define data selecionada no formato "dia-mes-ano"
        CalendarioController.dataSelecionada =
            `${diaNum}-${(mesNum + 1)}-${anoNum}`;
        console.log(CalendarioController.dataSelecionada);

        // Notifica componente pai para atualizar display (converte - para /)
        if (setDataDisplay) {
            setDataDisplay(CalendarioController.dataSelecionada.replaceAll('-', '/'));
        }

        // Atualiza estado local do dia selecionado
        setDiaSelecionado({
            dia: diaNum,
            mes: mesNum,
            ano: anoNum
        });

        // Cria objeto de dia com dados do backend (ou vazio se dia novo)
        var objetoDia = {
            data: `${diaNum}-${(mesNum + 1)}-${anoNum}`,
            usuario: NutryoFetch.email,
            corpo: NutryoFetch.retornaRefeicoesDoDia(`${diaNum}-${(mesNum + 1)}-${anoNum}`) || []
        }

        // Gera objeto de dia no diaObjeto para uso global
        diaObjeto.gerarDia(
            objetoDia.data,
            objetoDia.usuario,
            objetoDia.corpo
        )

        // Notifica que um dia foi clicado (para exibir janela no mobile)
        if (onDiaClick) {
            onDiaClick();
        }
    }

    // Renderização JSX do calendário
    return (
        // <!-- Sessão calendário -->
        <section className="calendario">

            {/*  Título do calendário  */}
            <div className="calendario-titulo">Calendário</div>

            {/*  Label com mes/ano  */}
            <div className="calendario-mes-ano">
                <div className="mes-ano-back" onClick={() => navegarMes("anterior")}>&lt;</div>
                <div className="mes-ano-label">
                    {CalendarioController.mesStringAtual} / {CalendarioController.anoSelecionado}
                </div>
                <div className="mes-ano-forward" onClick={() => { navegarMes("proximo") }}>&gt;</div>
            </div>

            {/*  Corpo do calendário (dias)  */}
            <div className="calendario-corpo">
                <div className="calendario-corpo-semana">
                    <div className="dia-semana">dom</div>
                    <div className="dia-semana">seg</div>
                    <div className="dia-semana">ter</div>
                    <div className="dia-semana">qua</div>
                    <div className="dia-semana">qui</div>
                    <div className="dia-semana">sex</div>
                    <div className="dia-semana">sab</div>
                </div>

                {/* dias adicionados dinamicamente */}
                {dias.map((dia: any) => {
                    // Verifica se o dia tem anotações (refeições) consultando NutryoFetch
                    const dataDia = `${dia.dia}-${(CalendarioController.mesSelecionado + 1)}-${CalendarioController.anoSelecionado}`;
                    const temRefeicoes = dia.tipo === "mesAtual" && NutryoFetch.retornaRefeicoesDoDia(dataDia)?.length > 0;

                    return (
                        <Dia
                            key={dia.index as number}
                            dia={dia.dia}
                            tipo={dia.tipo}
                            temAnotacao={temRefeicoes}
                            selecionado={
                                diaSelecionado !== null &&
                                diaSelecionado.dia === dia.dia &&
                                CalendarioController.mesSelecionado === diaSelecionado.mes &&
                                CalendarioController.anoSelecionado === diaSelecionado.ano &&
                                dia.tipo === "mesAtual"
                            }
                            onSelect={() => selecionarDia(dia)}
                        />
                    );
                })}

            </div>
        </section >
    )
}

export default Calendario;