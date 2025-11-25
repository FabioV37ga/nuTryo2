/**
 * Componente FichaGorduras
 * 
 * Exibe a ficha de estatísticas de gorduras com:
 * - Consumo atual do usuário
 * - Meta personalizável
 * - Barra de progresso visual
 */

import EstatisticasController from "../../../controllers/estatisticas/estatisticasController";

interface FichaGordurasProps {
    consumo: number;
    meta: string;
    onMetaChange: (novoValor: string) => void;
}

function FichaGorduras({ consumo, meta, onMetaChange }: FichaGordurasProps) {
    // Calcula porcentagem do consumo em relação à meta
    const metaNum = Number(meta) || 1; // Evita divisão por zero
    const porcentagem = Math.min(Math.round((consumo / metaNum) * 100), 100); // Limita a 100%

    return (
        <div className="estatisticas-informacoes informacoes-gorduras">
            {/* Título da ficha */}
            <h1>
                <img src="icon/gord.png" alt="Ícone de gorduras"/>
                Gorduras
            </h1>

            {/* Valores da ficha */}
            <div className="informacoes-valores">

                {/* Valor consumido pelo usuário */}
                <span className="informacoes-consumo info-consumo-gords">
                    {consumo} g
                </span>

                {/* Divisor em barra */}
                <span className="informacoes-consumo-divisor">/</span>

                {/* Valor de meta do usuário (editável) */}
                <div className="informacoes-meta info-meta-gords">
                    <input 
                        type="number" 
                        className="meta-gords-input" 
                        value={meta}
                        onChange={(e) => onMetaChange(e.target.value)}
                        style={{ width: EstatisticasController.calcularLarguraInput(meta) }}
                    />
                    <span>
                        g
                    </span>
                </div>
                
                {/* Ícone de edição */}
                <div className="meta-edit">
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                </div>

                {/* Barra de progresso */}
                <div className="progressBar">
                    <div 
                        className="progressBar-progress gords-progress"
                        style={{ width: `${porcentagem}%` }}
                    ></div>
                </div>

            </div>
        </div>
    );
}

export default FichaGorduras;
