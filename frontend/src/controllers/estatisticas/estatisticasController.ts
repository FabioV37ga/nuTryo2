/**
 * Controlador de Estatísticas
 * 
 * Gerencia:
 * - Cálculo de largura de inputs dinâmicos
 * - Busca de metas do usuário no backend
 * - Cálculo de macronutrientes (diário, semanal, mensal)
 * - Formatação de dados estatísticos
 */

import { backend } from "../../utils/connection";
import diaObjeto from "../../utils/diaObjeto";

class EstatisticasController {
    /**
     * Calcula a largura do input baseada no número de caracteres
     * @param valor - Valor a ser exibido no input
     * @returns String com largura em pixels (ex: "54px")
     */
    static calcularLarguraInput(valor: string | number): string {
        const texto = String(valor || '');
        const numCaracteres = texto.length || 1; // mínimo 1 para evitar width 0
        // cada caractere ocupa ~12px + 12px fixos adicionais
        const largura = Math.max(numCaracteres * 12 + 12, 42); // mínimo 42px (30 + 12)
        return `${largura}px`;
    }

    /**
     * Retorna o número de caracteres do valor (para cálculo)
     * @param valor - Valor a contar caracteres
     * @returns Número de caracteres
     */
    static contarCaracteres(valor: string | number): number {
        return String(valor || '').length || 1;
    }

    /**
     * Busca as metas nutricionais do usuário no backend
     * @param email - Email do usuário
     * @returns Promise com objeto de metas ou null em caso de erro
     */
    static async retornaMetas(email: string): Promise<any> {
        try {
            const resposta = await fetch(`${backend}/metas/${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!resposta.ok) {
                throw new Error(`Erro ao buscar metas: ${resposta.status}`);
            }

            const data = await resposta.json();
            
            // Retorna o primeiro item do array (metas do usuário)
            return data[0] || null;
        } catch (erro) {
            console.error('Erro ao buscar metas:', erro);
            return null;
        }
    }

    /**
     * Atualiza as metas do usuário no backend
     * @param email - Email do usuário
     * @param metas - Objeto com as novas metas
     * @returns Promise com resultado da atualização
     */
    static async atualizarMetas(email: string, metas: {
        metaCalorias?: number;
        metaProteinas?: number;
        metaCarboidratos?: number;
        metaGorduras?: number;
    }): Promise<any> {
        try {
            const resposta = await fetch(`${backend}/metas/${email}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(metas)
            });

            if (!resposta.ok) {
                throw new Error(`Erro ao atualizar metas: ${resposta.status}`);
            }

            const data = await resposta.json();
            return data;
        } catch (erro) {
            console.error('Erro ao atualizar metas:', erro);
            return null;
        }
    }

    /**
     * Calcula macronutrientes de um dia específico
     * @param dia - Objeto do dia com refeições e alimentos
     * @returns Objeto com totais de calorias, proteínas, carboidratos e gorduras
     */
    static calcularMacrosDia(dia: any) {
        let totais = {
            calorias: 0,
            proteinas: 0,
            carboidratos: 0,
            gorduras: 0
        };

        // Verifica se existe dia e se possui refeições
        if (!dia || !dia.refeicoes) {
            return totais;
        }

        // Percorre todas as refeições do dia
        for (const refeicao of dia.refeicoes) {
            // Verifica se a refeição possui alimentos
            if (!refeicao.alimentos) continue;

            // Percorre todos os alimentos da refeição
            for (const alimento of refeicao.alimentos) {
                const peso = Number(alimento.peso) || 0;
                const referencia = 100; // Os valores salvos são para 100g
                
                // Recalcula macros proporcionalmente ao peso consumido
                // Fórmula: (peso_consumido * valor_base_100g) / 100
                totais.calorias += (peso * (Number(alimento.calorias) || 0)) / referencia;
                totais.proteinas += (peso * (Number(alimento.proteinas) || 0)) / referencia;
                totais.carboidratos += (peso * (Number(alimento.carboidratos) || 0)) / referencia;
                totais.gorduras += (peso * (Number(alimento.gorduras) || 0)) / referencia;
            }
        }

        // Arredonda os valores para número inteiro
        totais.calorias = Math.round(totais.calorias);
        totais.proteinas = Math.round(totais.proteinas);
        totais.carboidratos = Math.round(totais.carboidratos);
        totais.gorduras = Math.round(totais.gorduras);

        return totais;
    }

    /**
     * Calcula macronutrientes do dia atual (hoje)
     * @returns Objeto com totais de calorias, proteínas, carboidratos e gorduras
     */
    static calcularMacrosHoje() {
        // Obtém a data de hoje no formato "dia-mes-ano"
        const hoje = new Date();
        const dia = hoje.getDate();
        const mes = hoje.getMonth() + 1; // getMonth() retorna 0-11
        const ano = hoje.getFullYear();
        const dataHoje = `${dia}-${mes}-${ano}`;

        // Busca o dia de hoje em diasSalvos
        const diaHoje = diaObjeto.diasSalvos.find(d => d.id === dataHoje);

        // Se não houver dados para hoje, retorna zeros
        if (!diaHoje) {
            return {
                calorias: 0,
                proteinas: 0,
                carboidratos: 0,
                gorduras: 0
            };
        }

        return this.calcularMacrosDia(diaHoje);
    }

    /**
     * Calcula macronutrientes da semana atual (domingo a sábado)
     * @returns Objeto com totais de calorias, proteínas, carboidratos e gorduras
     */
    static calcularMacrosSemana() {
        const hoje = new Date();
        const diaDaSemana = hoje.getDay(); // 0 = domingo, 6 = sábado
        
        // Calcula o domingo da semana atual
        const domingo = new Date(hoje);
        domingo.setDate(hoje.getDate() - diaDaSemana);
        domingo.setHours(0, 0, 0, 0);
        
        // Calcula o sábado da semana atual
        const sabado = new Date(domingo);
        sabado.setDate(domingo.getDate() + 6);
        sabado.setHours(23, 59, 59, 999);
        
        let totais = {
            calorias: 0,
            proteinas: 0,
            carboidratos: 0,
            gorduras: 0
        };
        
        // Percorre todos os dias salvos
        for (const dia of diaObjeto.diasSalvos) {
            // Converte o id do dia (formato: "dia-mes-ano") para objeto Date
            const [diaNum, mes, ano] = dia.id.split('-').map(Number);
            const dataDia = new Date(ano, mes - 1, diaNum);
            
            // Verifica se o dia está dentro da semana atual
            if (dataDia >= domingo && dataDia <= sabado) {
                const macrosDia = this.calcularMacrosDia(dia);
                totais.calorias += macrosDia.calorias;
                totais.proteinas += macrosDia.proteinas;
                totais.carboidratos += macrosDia.carboidratos;
                totais.gorduras += macrosDia.gorduras;
            }
        }
        
        return totais;
    }

    /**
     * Calcula macronutrientes do mês atual (dia 1 até último dia)
     * @returns Objeto com totais de calorias, proteínas, carboidratos e gorduras
     */
    static calcularMacrosMes() {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth();
        
        // Primeiro dia do mês
        const primeiroDia = new Date(ano, mes, 1, 0, 0, 0, 0);
        
        // Último dia do mês
        const ultimoDia = new Date(ano, mes + 1, 0, 23, 59, 59, 999);
        
        let totais = {
            calorias: 0,
            proteinas: 0,
            carboidratos: 0,
            gorduras: 0
        };
        
        // Percorre todos os dias salvos
        for (const dia of diaObjeto.diasSalvos) {
            // Converte o id do dia (formato: "dia-mes-ano") para objeto Date
            const [diaNum, mesNum, anoNum] = dia.id.split('-').map(Number);
            const dataDia = new Date(anoNum, mesNum - 1, diaNum);
            
            // Verifica se o dia está dentro do mês atual
            if (dataDia >= primeiroDia && dataDia <= ultimoDia) {
                const macrosDia = this.calcularMacrosDia(dia);
                totais.calorias += macrosDia.calorias;
                totais.proteinas += macrosDia.proteinas;
                totais.carboidratos += macrosDia.carboidratos;
                totais.gorduras += macrosDia.gorduras;
            }
        }
        
        return totais;
    }
}

export default EstatisticasController;
