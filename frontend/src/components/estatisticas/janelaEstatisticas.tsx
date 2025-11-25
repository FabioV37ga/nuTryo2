import { useState } from "react";
import "../../styles/estatisticas/estatisticas-mobile.css"
import "../../styles/estatisticas/estatisticas.css"
import EstatisticasController from "../../controllers/estatisticas/estatisticasController";

interface JanelaEstatisticasProps {
    onClose?: () => void;
}

function JanelaEstatisticas({ onClose }: JanelaEstatisticasProps){
    // Estados para as metas (valores padrão para exemplo)
    const [metaKcal, setMetaKcal] = useState<string>('2000');
    const [metaProts, setMetaProts] = useState<string>('150');
    const [metaCarbs, setMetaCarbs] = useState<string>('250');
    const [metaGords, setMetaGords] = useState<string>('70');

    return (
        <section className="janela-estatisticas">

            {/* <!-- Título da janela de estatísticas --> */}
            <div className="janela-estatisticas-titulo">
                Estatísticas
            </div>

            <div className="janela-estatisticas-close" role="button" tabIndex={0} onClick={onClose} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' ') onClose && onClose();}}>
                <i className="fa fa-times" aria-hidden="true"></i>
            </div>

            {/* <!-- Seletor de período --> */}
            <nav className="janela-estatisticas-nav">

                {/* <!-- Periodo: Diário --> */}
                <div className="estatisticas-hoje periodo-selecionado">
                    <span>
                        Hoje
                    </span>
                </div>

                {/* <!-- Período: Semanal --> */}
                <div className="estatisticas-semana">
                    <span>
                        Essa semana
                    </span>
                </div>

                {/* <!-- Período: Total --> */}
                <div className="estatisticas-totais">
                    <span>
                        Último mês
                    </span>
                </div>
            </nav>

            {/* <!-- Informações estatísticas --> */}
            <div className="sessao-estatisticas-informacoes">

                {/* <!-- Sessão de calorias --> */}
                <div className="estatisticas-informacoes informacoes-calorias">
                    {/* <!-- Título da sessão --> */}
                    <h1>
                        <img src="icon/kcal.png" alt=""/>
                        Calorias
                    </h1>

                    {/* <!-- Valores da sessão --> */}
                    <div className="informacoes-valores">

                        {/* <!-- Valor consumido pelo usuário --> */}
                        <span className="informacoes-consumo info-consumo-kcal">
                            1.850 kcal
                        </span>

                        {/* <!-- Divisor em barra --> */}
                        <span className="informacoes-consumo-divisor">/</span>

                        {/* <!-- Valor de meta do usuário --> */}
                        <div className="informacoes-meta info-meta-kcal">
                            <input 
                                type="number" 
                                className="meta-kcal-input" 
                                value={metaKcal}
                                onChange={(e) => setMetaKcal(e.target.value)}
                                style={{ width: EstatisticasController.calcularLarguraInput(metaKcal) }}
                            />
                            <span>
                                kcal
                            </span>
                        </div>
                        <div className="meta-edit">
                            <i className="fa fa-pencil" aria-hidden="true"></i>
                        </div>

                        <div className="progressBar">
                            <div className="progressBar-progress kcal-progress"></div>
                        </div>

                    </div>
                </div>

                {/* <!-- Sessão de proteínas --> */}
                <div className="estatisticas-informacoes informacoes-proteinas">
                    {/* <!-- Título da sessão --> */}
                    <h1>
                        <img src="icon/prot.png" alt=""/>
                        Proteínas
                    </h1>

                    {/* <!-- Valores da sessão --> */}
                    <div className="informacoes-valores">

                        {/* <!-- Valor consumido pelo usuário --> */}
                        <span className="informacoes-consumo info-consumo-prots">
                            130 g
                        </span>

                        {/* <!-- Divisor em barra --> */}
                        <span className="informacoes-consumo-divisor">/</span>

                        {/* <!-- Valor de meta do usuário --> */}
                        <div className="informacoes-meta info-meta-prots">
                            <input 
                                type="number" 
                                className="meta-prots-input" 
                                value={metaProts}
                                onChange={(e) => setMetaProts(e.target.value)}
                                style={{ width: EstatisticasController.calcularLarguraInput(metaProts) }}
                            />
                            <span>
                                g
                            </span>
                        </div>
                        <div className="meta-edit">
                            <i className="fa fa-pencil" aria-hidden="true"></i>
                        </div>

                        <div className="progressBar">
                            <div className="progressBar-progress prot-progress"></div>
                        </div>

                    </div>
                </div>

                {/* <!-- Sessão de carboidratos --> */}
                <div className="estatisticas-informacoes informacoes-carboidratos">
                    {/* <!-- Título da sessão --> */}
                    <h1>
                        <img src="icon/carb.png" alt=""/>
                        Carboidratos
                    </h1>

                    {/* <!-- Valores da sessão --> */}
                    <div className="informacoes-valores">

                        {/* <!-- Valor consumido pelo usuário --> */}
                        <span className="informacoes-consumo info-consumo-carbs">
                            210 g
                        </span>

                        {/* <!-- Divisor em barra --> */}
                        <span className="informacoes-consumo-divisor">/</span>

                        {/* <!-- Valor de meta do usuário --> */}
                        <div className="informacoes-meta info-meta-carbs">
                            <input 
                                type="number" 
                                className="meta-carbs-input" 
                                value={metaCarbs}
                                onChange={(e) => setMetaCarbs(e.target.value)}
                                style={{ width: EstatisticasController.calcularLarguraInput(metaCarbs) }}
                            />
                            <span>
                                g
                            </span>
                        </div>
                        <div className="meta-edit">
                            <i className="fa fa-pencil" aria-hidden="true"></i>
                        </div>

                        <div className="progressBar">
                            <div className="progressBar-progress carbs-progress"></div>
                        </div>

                    </div>
                </div>

                {/* <!-- Sessão de gorduras --> */}
                <div className="estatisticas-informacoes informacoes-gorduras">
                    {/* <!-- Título da sessão --> */}
                    <h1>
                        <img src="icon/gord.png" alt=""/>
                        Gorduras
                    </h1>

                    {/* <!-- Valores da sessão --> */}
                    <div className="informacoes-valores">

                        {/* <!-- Valor consumido pelo usuário --> */}
                        <span className="informacoes-consumo info-consumo-gords">
                            65 g
                        </span>

                        {/* <!-- Divisor em barra --> */}
                        <span className="informacoes-consumo-divisor">/</span>

                        {/* <!-- Valor de meta do usuário --> */}
                        <div className="informacoes-meta info-meta-gords">
                            <input 
                                type="number" 
                                className="meta-gords-input" 
                                value={metaGords}
                                onChange={(e) => setMetaGords(e.target.value)}
                                style={{ width: EstatisticasController.calcularLarguraInput(metaGords) }}
                            />
                            <span>
                                g
                            </span>
                        </div>
                        <div className="meta-edit">
                            <i className="fa fa-pencil" aria-hidden="true"></i>
                        </div>

                        <div className="progressBar">
                            <div className="progressBar-progress gords-progress"></div>
                        </div>

                    </div>
                </div>

            </div>

        </section>
        )
    }

    export default JanelaEstatisticas;