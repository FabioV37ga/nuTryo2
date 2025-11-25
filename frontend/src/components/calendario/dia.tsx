/**
 * Componente Dia
 * 
 * Representa um único dia no calendário.
 * 
 * Funcionalidades:
 * - Exibe número do dia
 * - Aplica estilos diferentes para dias de meses anterior/atual/seguinte
 * - Destaca dia selecionado
 * - Indica visualmente dias com anotações/refeições
 * - Responde a cliques para seleção
 * 
 * @component
 * @param {object} props
 * @param {number} props.dia - Número do dia (1-31)
 * @param {string} props.tipo - Tipo do dia: "mesAtual", "mesAnterior" ou "mesSeguinte"
 * @param {boolean} [props.selecionado] - Se o dia está selecionado
 * @param {boolean} [props.temAnotacao] - Se o dia tem refeições registradas
 * @param {function} [props.onSelect] - Callback quando dia é clicado
 */

interface DiaProps {
    dia: number;
    tipo: string;
    selecionado?: boolean;
    temAnotacao?: boolean;
    onSelect?: () => void;
}

function Dia({dia, tipo, selecionado, temAnotacao, onSelect}: DiaProps) {
    return (
        // Aplica classes CSS baseadas no estado do dia
        <div className={`dia ${tipo} ${selecionado ? "diaSelecionado" : ""} ${temAnotacao ? "diaComAnotacao" : ""}`} onClick={onSelect}>
            {dia}
        </div>
    )
}

export default Dia;