import { useState, useEffect } from "react";

import "../../styles/calendario/calendario.css"

import CalendarioController from "../../controllers/calendario/calendarioController";
import Dia from "./dia";
import diaObjeto from "../../utils/diaObjeto";
import NutryoFetch from "../../utils/nutryoFetch";

function Calendario({ setDataDisplay }: { setDataDisplay?: (data: string) => void }) {
    // Estado para os dias do calendário
    const [dias, setDias] = useState(() => {
        const dataAtual = new Date();
        return CalendarioController.gerarArrayDias(
            dataAtual.getMonth(),
            dataAtual.getFullYear()
        );
    });

    // Função para navegar entre meses
    function navegarMes(direcao: "anterior" | "proximo") {
        const novosDias = CalendarioController.navegarMes(direcao);
        setDias(novosDias);
    }

    // Estado para dia selecionado (armazenamos dia + mês + ano para poder restaurar ao navegar)
    const [diaSelecionado, setDiaSelecionado] = useState<{
        dia: number;
        mes: number;
        ano: number;
    } | null>(() => ({
        dia: CalendarioController.diaSelecionado,
        mes: CalendarioController.mesSelecionado,
        ano: CalendarioController.anoSelecionado
    }));

    // useEffect para selecionar o dia ao montar o componente
    useEffect(() => {
        const diaAtualSelecionado = CalendarioController.diaSelecionado;
        const mesAtualSelecionado = CalendarioController.mesSelecionado;

        // Encontrar o dia correspondente no array dias
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

    // Função para selecionar dia
    function selecionarDia(dia: { dia: number; index: number; tipo: string }) {
        // Se o usuário clicar em um dia que pertence ao mês anterior/próximo,
        // navegamos para esse mês (CalendarioController ajusta mesSelecionado/anoSelecionado)
        if (dia.tipo === "mesAnterior") {
            navegarMes("anterior");
        }

        if (dia.tipo === "mesSeguinte") {
            navegarMes("proximo");
        }

        // Atualiza o dia selecionado no controller
        const diaNum = dia.dia;
        const mesNum = CalendarioController.mesSelecionado;
        const anoNum = CalendarioController.anoSelecionado;

        CalendarioController.dataSelecionada =
            `${diaNum}-${(mesNum + 1)}-${anoNum}`;
        console.log(CalendarioController.dataSelecionada);

        // Atualiza o label da janela
        if (setDataDisplay) {
            setDataDisplay(CalendarioController.dataSelecionada.replaceAll('-', '/'));
        }


        setDiaSelecionado({
            dia: diaNum,
            mes: mesNum,
            ano: anoNum
        });

        var objetoDia = {
            data: `${diaNum}-${(mesNum + 1)}-${anoNum}`,
            usuario: NutryoFetch.email,
            corpo: NutryoFetch.retornaRefeicoesDoDia(`${diaNum}-${(mesNum + 1)}-${anoNum}`) || []
        }

        diaObjeto.gerarDia(
            objetoDia.data,
            objetoDia.usuario,
            objetoDia.corpo
        )
    }

    // Retorno JSX
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