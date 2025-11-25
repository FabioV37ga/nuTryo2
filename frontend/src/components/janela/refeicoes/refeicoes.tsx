interface RefeicaoProps {
    id: number;
    tipo: string;
    titulo: string;
    onDelete: (id: number) => void;
    adicionarAba: (id: number) => void;
}

function Refeicoes({ id, tipo, titulo, onDelete, adicionarAba }: RefeicaoProps) {
    return (
        <div className="refeicao" data-value={id}>
            <a className="botao-editar-refeicao" onClick={() => adicionarAba(id)}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
            </a>
            <span className="refeicao-list-label">
                <h1>{tipo}</h1>
                <span>{titulo}</span>
            </span>
            <div
                className="botao-apagar-refeicao"
                role="button"
                tabIndex={0}
                onClick={() => onDelete && onDelete(id)}
            >
                <i className="fa fa-trash" aria-hidden="true"></i>
            </div>
        </div>
    )

}

export default Refeicoes;