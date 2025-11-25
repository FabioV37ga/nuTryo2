/**
 * Componente FichaCalorias
 * 
 * Exibe a ficha de estatísticas de calorias com:
 * - Consumo atual do usuário
 * - Meta personalizável
 * - Barra de progresso visual
 */

import { useRef } from "react";
import EstatisticasController from "../../../controllers/estatisticas/estatisticasController";
import authController from "../../../controllers/auth/authController";

interface FichaCaloriasProps {
    consumo: number;
    meta: string;
    onMetaChange: (novoValor: string) => void;
    editavel?: boolean;
}

function FichaCalorias({ consumo, meta, onMetaChange, editavel = true }: FichaCaloriasProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleEditClick = () => {
        inputRef.current?.focus();
    };

    const handleBlur = async () => {
        const email = authController.email;
        if (email) {
            await EstatisticasController.atualizarMetas(email, {
                metaCalorias: Number(meta)
            });
        }
    };

    // Calcula porcentagem do consumo em relação à meta
    const metaNum = Number(meta) || 1; // Evita divisão por zero
    const porcentagem = Math.min(Math.round((consumo / metaNum) * 100), 100); // Limita a 100%

    return (
        <div className="estatisticas-informacoes informacoes-calorias">
            {/* Título da ficha */}
            <h1>
                <img src="icon/kcal.png" alt="Ícone de calorias"/>
                Calorias
            </h1>

            {/* Valores da ficha */}
            <div className="informacoes-valores">

                {/* Valor consumido pelo usuário */}
                <span className="informacoes-consumo info-consumo-kcal">
                    {consumo} kcal
                </span>

                {/* Divisor em barra */}
                <span className="informacoes-consumo-divisor">/</span>

                {/* Valor de meta do usuário (editável) */}
                <div className="informacoes-meta info-meta-kcal">
                    <input 
                        ref={inputRef}
                        type="number" 
                        className="meta-kcal-input" 
                        value={meta}
                        onChange={(e) => onMetaChange(e.target.value)}
                        onBlur={handleBlur}
                        style={{ width: EstatisticasController.calcularLarguraInput(meta) }}
                    />
                    <span>
                        kcal
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
                        className="progressBar-progress kcal-progress"
                        style={{ width: `${porcentagem}%` }}
                    ></div>
                </div>

            </div>
        </div>
    );
}

export default FichaCalorias;
