/**
 * Componente FichaGorduras
 * 
 * Exibe a ficha de estatísticas de gorduras com:
 * - Consumo atual do usuário
 * - Meta personalizável
 * - Barra de progresso visual
 */

import { useRef } from "react";
import EstatisticasController from "../../../controllers/estatisticas/estatisticasController";
import authController from "../../../controllers/auth/authController";

interface FichaGordurasProps {
    consumo: number;
    meta: string;
    onMetaChange: (novoValor: string) => void;
    editavel?: boolean;
}

function FichaGorduras({ consumo, meta, onMetaChange, editavel = true }: FichaGordurasProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleEditClick = () => {
        inputRef.current?.focus();
    };

    const handleBlur = async () => {
        const email = authController.email;
        if (email) {
            await EstatisticasController.atualizarMetas(email, {
                metaGorduras: Number(meta)
            });
        }
    };

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
                        ref={inputRef}
                        type="number" 
                        className="meta-gords-input" 
                        value={meta}
                        onChange={(e) => onMetaChange(e.target.value)}
                        onBlur={handleBlur}
                        style={{ width: EstatisticasController.calcularLarguraInput(meta) }}
                    />
                    <span>
                        g
                    </span>
                </div>
                
                {/* Ícone de edição */}
                {editavel && (
                    <div className="meta-edit" onClick={handleEditClick} style={{ cursor: 'pointer' }}>
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                    </div>
                )}

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
