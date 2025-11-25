interface DiaProps {
    dia: number;
    tipo: string;
    selecionado?: boolean;
    temAnotacao?: boolean;
    onSelect?: () => void;
}

function Dia({dia, tipo, selecionado, temAnotacao, onSelect}: DiaProps) {
    return (
        <div className={`dia ${tipo} ${selecionado ? "diaSelecionado" : ""} ${temAnotacao ? "diaComAnotacao" : ""}`} onClick={onSelect}>
            {dia}
        </div>
    )
}

export default Dia;