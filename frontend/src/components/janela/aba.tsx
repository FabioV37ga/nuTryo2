/**
 * Componente Aba
 * 
 * Representa uma aba clicável na barra de navegação da janela.
 * 
 * Funcionalidades:
 * - Exibe título da aba
 * - Destaca aba ativa
 * - Botão de fechar (opcional)
 * - Responde a cliques para seleção
 * - Acessibilidade via teclado (Enter/Space)
 * 
 * @component
 * @param {object} props
 * @param {any} props.id - Identificador único da aba
 * @param {string} props.titulo - Título exibido na aba
 * @param {boolean} props.ativa - Se a aba está atualmente selecionada
 * @param {function} [props.onClose] - Callback quando botão fechar é clicado
 * @param {function} [props.onSelect] - Callback quando aba é selecionada
 * @param {boolean} [props.closable=true] - Se a aba pode ser fechada
 */

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
            {/* Título da aba */}
            <div className="refeicao-label">{titulo}</div>
            
            {/* Botão de fechar (renderizado se closable é true ou undefined) */}
            { (typeof (closable) === 'undefined' || closable) && (
                <span className="refeicao-fechar" role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); onClose && onClose(); }} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') ) { e.stopPropagation(); onClose && onClose(); } }}>
                    <i className="fa fa-times" aria-hidden="true"></i>
                </span>
            )}
        </a>
    )
}

export default aba;