/**
 * Componente FichaCarboidratos
 * 
 * Exibe a ficha de estatísticas de carboidratos com:
 * - Consumo atual do usuário
 * - Meta personalizável
 * - Barra de progresso visual
 */

import { useRef } from "react";
import EstatisticasController from "../../../controllers/estatisticas/estatisticasController";
import authController from "../../../controllers/auth/authController";

interface FichaCarboidratosProps {
    consumo: number;
    meta: string;
    onMetaChange: (novoValor: string) => void;
    editavel?: boolean;
}

function FichaCarboidratos({ consumo, meta, onMetaChange, editavel = true }: FichaCarboidratosProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleEditClick = () => {
        inputRef.current?.focus();
    };

    const handleBlur = async () => {
        const email = authController.email;
        if (email) {
            await EstatisticasController.atualizarMetas(email, {
                metaCarboidratos: Number(meta)
            });
        }
    };

    // Calcula porcentagem do consumo em relação à meta
    const metaNum = Number(meta) || 1; // Evita divisão por zero
    const porcentagem = Math.min(Math.round((consumo / metaNum) * 100), 100); // Limita a 100%

    return (
        <div className="estatisticas-informacoes informacoes-carboidratos">
            {/* Título da ficha */}
            <h1>
                <img src="icon/carb.png" alt="Ícone de carboidratos"/>
                Carboidratos
            </h1>

            {/* Valores da ficha */}
            <div className="informacoes-valores">

                {/* Valor consumido pelo usuário */}
                <span className="informacoes-consumo info-consumo-carbs">
                    {consumo} g
                </span>

                {/* Divisor em barra */}
                <span className="informacoes-consumo-divisor">/</span>

                {/* Valor de meta do usuário (editável) */}
                <div className="informacoes-meta info-meta-carbs">
                    <input 
                        ref={inputRef}
                        type="number" 
                        className="meta-carbs-input" 
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
                        className="progressBar-progress carbs-progress"
                        style={{ width: `${porcentagem}%` }}
                    ></div>
                </div>

            </div>
        </div>
    );
}

export default FichaCarboidratos;
