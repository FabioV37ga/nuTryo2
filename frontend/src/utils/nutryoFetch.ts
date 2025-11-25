/**
 * Classe NutryoFetch
 * 
 * Gerencia comunicação com o backend e cache local de dados do usuário.
 * 
 * Responsabilidades:
 * - Buscar dados do backend (dias, refeições, alimentos)
 * - Manter cache local dos dados para acesso rápido
 * - Fornecer métodos utilitários para consultar dados específicos
 * - Gerenciar informações do usuário (email, nome)
 * 
 * Padrão de uso:
 * 1. Inicializar com NutryoFetch.iniciar(email, nome)
 * 2. Acessar dados através dos métodos retorna*()
 * 3. Dados ficam em cache (objects, metas)
 * 
 * @class
 */
import { backend } from "./connection";
import diaObjeto from "./diaObjeto";

class NutryoFetch {
    /** Array com todos os objetos de dias do usuário (cache local) */
    static objects: any[] = [];
    
    /** Objeto com metas nutricionais do usuário */
    static metas: any;
    
    /** Nome do usuário */
    static username: string = '';
    
    /** Email do usuário (usado como identificador) */
    static email: string = '';

    /**
     * Inicializa o NutryoFetch e busca dados do usuário
     * 
     * @static
     * @async
     * @param {string} email - Email do usuário
     * @param {string} [nome] - Nome do usuário (opcional)
     * @returns {Promise<any>} Dados dos dias do usuário
     * 
     * Processo:
     * 1. Armazena email e nome
     * 2. Busca todos os dias do usuário do backend
     * 3. Retorna dados para uso imediato
     */
    static async iniciar(email: string, nome?: string) {
        NutryoFetch.username = nome ? nome : '';
        NutryoFetch.email = email;

        return await NutryoFetch.fetchDias(email);
    }

    /**
     * Busca todos os dias do usuário no backend
     * 
     * @static
     * @async
     * @param {string} email - Email do usuário
     * @returns {Promise<any>} Array de dias com refeições e alimentos
     * 
     * Processo:
     * 1. Faz requisição GET para /refeicoes/:email
     * 2. Armazena dados em objects (cache NutryoFetch)
     * 3. Armazena dados em diasSalvos (cache diaObjeto)
     * 4. Retorna dados
     */
    static async fetchDias(email: string) {
        const resposta = await fetch(`${backend}/refeicoes/${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await resposta.json();

        // Armazena dados no cache local (NutryoFetch)
        NutryoFetch.objects = data;

        // Armazena dados no cache do diaObjeto
        diaObjeto.diasSalvos = data;

        console.log(data)
        return data;
    }

    /**
     * Retorna as refeições de um dia específico
     * 
     * @static
     * @param {string} data - Data no formato "dia-mes-ano" (ex: "25-11-2025")
     * @returns {any[] | undefined} Array de refeições do dia ou undefined se não encontrado
     * 
     * Busca no cache local (diasSalvos) pela data fornecida.
     * Cada refeição contém: _id, tipo, alimentos[]
     */
    static retornaRefeicoesDoDia(data: string) {
        // Busca o dia nos objetos locais (cache)
        for (let dia = 0; dia <= diaObjeto.diasSalvos.length - 1; dia++) {

            // Se dia existe e a data corresponde, retorna suas refeições
            if (diaObjeto.diasSalvos[dia]) {
                if (data == diaObjeto.diasSalvos[dia].id) {
                    return diaObjeto.diasSalvos[dia].refeicoes
                }
            }
        }
    }

    /**
     * Retorna uma refeição específica de um dia
     * 
     * @static
     * @param {string} data - Data no formato "dia-mes-ano"
     * @param {string} refeicao - ID da refeição (1, 2, 3...)
     * @returns {any | undefined} Objeto da refeição ou undefined se não encontrado
     * 
     * Processo:
     * 1. Busca todas as refeições do dia via retornaRefeicoesDoDia()
     * 2. Filtra pela refeição específica usando _id
     * 3. Retorna objeto com: _id, tipo, alimentos[]
     */
    static retornaRefeicao(data: string, refeicao: string) {

        // Busca todas as refeições do dia
        var refeicoes = NutryoFetch.retornaRefeicoesDoDia(data)

        // Se houver refeições no dia, busca a refeição específica
        if (refeicoes)
            for (let ref = 0; ref <= refeicoes.length - 1; ref++) {
                if (Number(refeicoes[ref]._id) == Number(refeicao)) {
                    return refeicoes[ref]
                }
            }
    }

    /**
     * Retorna os alimentos de uma refeição específica
     * 
     * @static
     * @param {string} data - Data no formato "dia-mes-ano"
     * @param {string} refeicao - ID da refeição
     * @returns {object[]} Array de alimentos ou array vazio se não encontrado
     * 
     * Processo:
     * 1. Busca refeição específica via retornaRefeicao()
     * 2. Extrai array de alimentos da refeição
     * 3. Retorna array (vazio se não houver alimentos)
     * 
     * Cada alimento contém: _id, alimento (nome), peso, calorias, proteinas, carboidratos, gorduras
     */
    static retornaAlimentosDaRefeicao(data: string, refeicao: string): object[] {

        // Busca a refeição específica
        var alimentos = NutryoFetch.retornaRefeicao(data, refeicao)

        // Array para armazenar os alimentos
        var listaAlimentos: object[] = [];

        // Se a refeição tem alimentos, adiciona ao array
        if (alimentos) {

            // Extrai array de alimentos da refeição
            alimentos = alimentos.alimentos

            // Popula lista de alimentos
            for (let alimento = 0; alimento <= alimentos.length - 1; alimento++) {
                listaAlimentos.push(alimentos[alimento])
            }
        }
        // Retorna lista de alimentos (vazia se não houver)
        return listaAlimentos
    }
}

export default NutryoFetch;