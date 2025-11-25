interface AbaProps {
    id: any;
    titulo: string;
    ativa: boolean;
    onClose?: () => void;
    onSelect?: () => void;
    closable?: boolean;
}

function aba({ id, titulo, ativa, onClose, onSelect, closable }: AbaProps) {
    return (
        <a
            className={`aba abaSelecionavel refeicao-aba ${ativa ? "abaSelecionada" : ""}`}
            data-value={id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect && onSelect()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect && onSelect(); }}
        >
            <div className="refeicao-label">{titulo}</div>
            { (typeof (closable) === 'undefined' || closable) && (
                <span className="refeicao-fechar" role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); onClose && onClose(); }} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') ) { e.stopPropagation(); onClose && onClose(); } }}>
                    <i className="fa fa-times" aria-hidden="true"></i>
                </span>
            )}
        </a>
    )
}

export default aba;