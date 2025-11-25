/**
 * Classe DiaObjeto
 * 
 * Gerencia o objeto de dia local e a sincronização com o backend.
 * 
 * Responsabilidades:
 * - Criar e manter estrutura de dados do dia (refeições e alimentos)
 * - Sincronizar alterações locais com o banco de dados
 * - Adicionar, editar e remover refeições e alimentos
 * - Decidir entre POST (novo dia) e PUT (editar dia existente)
 * - Manter IDs sequenciais para refeições e alimentos
 * 
 * Estrutura de dados:
 * ```
 * dia = {
 *   id: "dia-mes-ano",
 *   _usuario: "email@usuario.com",
 *   refeicoes: [
 *     {
 *       _id: 1,
 *       tipo: "Café da Manhã",
 *       alimentos: [
 *         { _id: 1, alimento: "Pão", peso: 50, calorias: 120, ... }
 *       ]
 *     }
 *   ]
 * }
 * ```
 * 
 * @class
 */
import CalendarioController from "../controllers/calendario/calendarioController.js";
import { backend } from "./connection.js";
import NutryoFetch from "./nutryoFetch.js";

class diaObjeto {
    /** Array com todos os dias salvos no banco (cache local) */
    static diasSalvos: any[] = [];
    
    /** Objeto do dia atual sendo manipulado */
    static dia: any = {};
    
    /** Array de refeições do dia atual */
    static refeicoes: any[] = [];
    
    /** Array de alimentos (buffer temporário) */
    static alimentos: object[] = []
    
    /** Email do usuário atual */
    static usuario: string = '';

    /**
     * Posta um novo dia no banco de dados
     * 
     * Processo:
     * 1. Envia requisição POST para criar novo dia
     * 2. Atualiza cache local com nova requisição GET
     * 
     * @static
     * @async
     * @returns {Promise<void>}
     */
    static async postarDiaBanco() {
        console.log("#diaObjeto !!! Requisição de post feita !!!")
        try {
            // Envia requisição POST ao backend para criar novo dia
            var resposta = await fetch(`${backend}/refeicoes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(diaObjeto.dia)
            })
            // Atualiza cache local com GET após POST bem-sucedido
            await NutryoFetch.fetchDias(diaObjeto.usuario)

            console.log("#diaObjeto - post bem sucedido")
            console.log("#diaObjeto - Iniciando nova requisição de get com novos itens...")

        } catch (error) {
            console.log("#diaObjeto - Erro no post")
        }
    }

    /**
     * Edita um dia existente no banco de dados
     * 
     * Processo:
     * 1. Envia requisição PUT com os dados atualizados
     * 2. Atualiza cache local com nova requisição GET
     * 
     * @static
     * @async
     * @returns {Promise<void>}
     */
    static async editarDiaBanco() {

        try {
            // Envia requisição PUT ao backend para atualizar dia existente
            const requisicao = await fetch(`${backend}/refeicoes/${NutryoFetch.email}/${diaObjeto.dia.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(diaObjeto.dia)
            })
            
        } catch (error) {
            console.log("#diaObjeto - Erro ao editar dia no banco")
        }
        // Atualiza cache local com GET após PUT
        await NutryoFetch.fetchDias(diaObjeto.usuario)
    }

    /**
     * Atualiza objetos locais (dia, refeição ou alimento)
     * 
     * @static
     * @param {string} campo - Tipo de atualização: "refeicao" ou "alimento"
     * @param {string} [local] - Índice da refeição no array (para alimentos)
     * @param {any} [objeto] - Objeto a ser adicionado/atualizado
     * 
     * Casos:
     * - "refeicao": Adiciona refeição ao array de refeições do dia
     * - "alimento": Adiciona ou atualiza alimento em uma refeição específica
     *   - Se alimento já existe (mesmo _id), substitui no mesmo índice
     *   - Se não existe, adiciona ao final
     *   - Após atualizar alimento, chama postarOuEditar()
     */
    static atualizarDia(campo: string, local?: string, objeto?: any[] | any) {
        switch (campo) {

            // Caso: Adicionar refeição ao dia
            case "refeicao":
                // Adiciona objeto de refeição ao array de refeições do dia
                diaObjeto.dia.refeicoes.push(objeto)
                break;

            // Caso: Adicionar ou atualizar alimento em uma refeição
            case "alimento":
                local = local ? local : "0";

                // Localiza o alimento a ser atualizado a partir do LOCAL passado como parâmetro
                const alimentos = diaObjeto.dia.refeicoes[Number(local)].alimentos;
                const index = alimentos.findIndex((item: any) => item._id === objeto._id);

                // Atualiza alimento:
                if (index !== -1) {
                    // Se existe, substitui no mesmo lugar (mantém ordem)
                    alimentos[index] = objeto;
                } else {
                    // Se não existe, adiciona ao final
                    alimentos.push(objeto);
                }

                // Após atualizar alimento, sincroniza com banco (POST ou PUT)
                diaObjeto.postarOuEditar();
                break;
        }
    }

    /**
     * Gera um objeto de dia completo
     * 
     * @static
     * @param {string} data - Data no formato "dia-mes-ano" (ex: "25-11-2025")
     * @param {string} usuario - Email do usuário
     * @param {object[]} corpo - Array de refeições do dia
     * 
     * Estrutura gerada:
     * ```
     * {
     *   id: "25-11-2025",
     *   _usuario: "email@usuario.com",
     *   refeicoes: [...]
     * }
     * ```
     */
    static gerarDia(data: string, usuario: string, corpo: object[]) {
        // Inicializa objeto de dia
        var objeto = {
            id: data,
            _usuario: usuario,
            refeicoes: corpo
        }
        // Atribui ao atributo estático da classe
        diaObjeto.dia = objeto

        console.log("#diaObjeto - Objeto dia gerado → " + CalendarioController.dataSelecionada)
        console.log(diaObjeto.dia)
    }

    /**
     * Gera um objeto de refeição
     * 
     * @static
     * @param {number} id - ID sequencial da refeição (1, 2, 3...)
     * @param {string} tipo - Tipo da refeição ("Café da Manhã", "Almoço", etc.)
     * @param {any[]} alimentos - Array de alimentos da refeição
     * 
     * Processo:
     * 1. Reseta array de alimentos temporário
     * 2. Cria objeto de refeição
     * 3. Adiciona ao array de refeições
     * 4. Atualiza objeto de dia
     */
    static gerarRefeicao(id: number, tipo: string, alimentos: any[]) {

        // Define o atributo refeições da classe como objeto vazio
        // diaObjeto.refeicoes = []

        // Reseta array de alimentos temporário
        diaObjeto.alimentos = []

        // Inicializa objeto de refeição
        var objeto = {
            _id: id,
            tipo: tipo,
            alimentos: alimentos
        }

        // Adiciona ao array de refeições
        diaObjeto.refeicoes.push(objeto)

        // Atualiza o dia com a refeição gerada
        diaObjeto.atualizarDia("refeicao", "", objeto)
    }

    /**
     * Gera um objeto de alimento e adiciona a uma refeição
     * 
     * @static
     * @param {string} refeicao - ID da refeição (base 1: "1", "2", "3"...)
     * @param {string} id - ID do alimento
     * @param {string} nome - Nome do alimento
     * @param {number} peso - Peso em gramas
     * @param {number} calorias - Calorias totais
     * @param {number} proteinas - Proteínas em gramas
     * @param {number} carboidratos - Carboidratos em gramas
     * @param {number} gorduras - Gorduras em gramas
     * 
     * Processo:
     * 1. Cria objeto de alimento com todos os macronutrientes
     * 2. Adiciona ao buffer temporário
     * 3. Atualiza o dia (converte ID de refeição para índice: refeicao-1)
     */
    static gerarAlimento(refeicao: string, id: string, nome: string, peso: number, calorias: number, proteinas: number, carboidratos: number, gorduras: number) {

        // Cria objeto de alimento com os parâmetros fornecidos
        var objeto = {
            _id: id,
            alimento: nome,
            peso: peso,
            calorias: calorias,
            proteinas: proteinas,
            carboidratos: carboidratos,
            gorduras: gorduras
        }

        // Adiciona ao buffer temporário de alimentos
        diaObjeto.alimentos.push(objeto)
        // Atualiza o dia (refeicao-1 para converter ID base-1 em índice base-0)
        diaObjeto.atualizarDia("alimento", String(Number(refeicao) - 1), objeto)
    }

    /**
     * Remove um alimento de uma refeição
     * 
     * @static
     * @param {string} refeicao - ID da refeição (base 1: "1", "2", "3"...)
     * @param {string} alimento - ID do alimento a ser removido
     * 
     * Processo:
     * 1. Filtra array de alimentos removendo o item
     * 2. Reindexa IDs dos alimentos restantes (mantém sequência 1, 2, 3...)
     *    - Alimentos com ID maior que o removido são decrementados
     * 3. Atualiza objeto de dia
     * 4. Chama postarOuEditar() para sincronizar com banco
     */
    static apagarAlimento(refeicao: string, alimento: string) {

        // Primeiro marca o alimento a ser apagado a partir dos atributos passados
        var alimentos = diaObjeto.dia.refeicoes[Number(refeicao) - 1].alimentos

        // Inicializa array de alimentos, esse array é uma cópia do array de alimentos sem o item apagado
        var alimentosFinal: any[] = []

        // Adiciona itens existêntes ao array, com exceção do item apagado
        for (let i = 0; i <= alimentos.length - 1; i++) {
            if (Number(alimentos[i]._id) != Number(alimento))
                alimentosFinal.push(alimentos[i])
        }

        // Decremente o ID dos alimentos que tinham ID maior do ID apagado, isso garante a ordem crescente dos IDS dos alimentos da lista
        for (let i = 0; i <= alimentosFinal.length - 1; i++) {
            if (Number(alimentosFinal[i]._id) > Number(alimento)) {
                alimentosFinal[i]._id = String(Number(alimentosFinal[i]._id) - 1)
            }
        }

        // Por fim, atribui o array de objetos sem o item apagado ao objeto de dia local
        diaObjeto.dia.refeicoes[Number(refeicao) - 1].alimentos = alimentosFinal

        // Depois de excluir o objeto, chama função para postar ou editar
        diaObjeto.postarOuEditar()

        // Logs
        // console.log("#diaObjeto - alimento removido")
        // console.log(diaObjeto.dia)

    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por apagar uma refeição dos objetos locais
    static apagarRefeicao(refeicao: string) {

        // Obtém array de refeições do dia
        var refeicoes = diaObjeto.dia.refeicoes

        // Array final sem a refeição removida
        var refeicoesFinais: any[] = []

        // Filtra refeições, excluindo a que foi removida
        for (let i = 0; i <= refeicoes.length - 1; i++) {
            if (
                Number(refeicoes[i]._id) != Number(refeicao)
            ) {
                refeicoesFinais.push(refeicoes[i])
            }
        }

        // Reindexa IDs: refeições com ID maior que o removido são decrementadas
        // Isso garante sequência contínua: 1, 2, 3, 4...
        for (let i = 0; i <= refeicoesFinais.length - 1; i++) {
            if (Number(refeicoesFinais[i]._id) > Number(refeicao)) {
                refeicoesFinais[i]._id = String(Number(refeicoesFinais[i]._id) - 1)
            }
        }

        // Atualiza array de refeições no objeto de dia
        diaObjeto.dia.refeicoes = refeicoesFinais

        // Sincroniza com banco (POST ou PUT)
        diaObjeto.postarOuEditar()

        console.log("#diaObjeto - refeição removida")
        console.log(diaObjeto.dia)
    }

    /**
     * Edita um dia específico no array de dias salvos localmente
     * 
     * @static
     * @param {string} data - Data do dia a ser editado ("dia-mes-ano")
     * @param {object} corpo - Novo corpo do dia (refeições)
     * 
     * Nota: Este método atualiza apenas o cache local, não o banco de dados
     */
    static editarDia(data: string, corpo: object) {
        // Busca dia específico no array de dias salvos
        for (let i = 0; i <= diaObjeto.diasSalvos.length - 1; i++) {

            // Quando encontra o dia pela data, atualiza seu corpo
            if (diaObjeto.diasSalvos[i].Id == data) {
                diaObjeto.diasSalvos[i] = corpo
            }
        }
    }

    /**
     * Decide se deve criar (POST) ou atualizar (PUT) um dia no banco
     * 
     * @static
     * 
     * Lógica:
     * - Verifica se o dia atual (diaObjeto.dia.id) já existe em diasSalvos
     * - Se existe: chama editarDiaBanco() para fazer PUT
     * - Se não existe: chama postarDiaBanco() para fazer POST
     * 
     * Este método é chamado automaticamente após alterações em alimentos/refeições
     */
    static postarOuEditar() {

        // Verifica se dia já existe no array de dias salvos
        for (let i = 0; i <= diaObjeto.diasSalvos.length - 1; i++) {
            if (diaObjeto.dia.id == diaObjeto.diasSalvos[i].id) {

                // Se já existe, edita o dia existente (PUT)
                diaObjeto.editarDiaBanco()
                return
            }
        }
        // Se não existe, cria novo dia (POST)
        diaObjeto.postarDiaBanco()
    }

    /**
     * Edita o tipo de uma refeição
     * 
     * @static
     * @param {string} idRefeicao - ID da refeição a ser editada
     * @param {string} novoTipo - Novo tipo da refeição ("Café da Manhã", "Almoço", etc.)
     * 
     * Processo:
     * 1. Localiza refeição no array de refeições do dia
     * 2. Atualiza propriedade 'tipo'
     * 3. Sincroniza com banco via postarOuEditar()
     */
    static editarTipoRefeicao(idRefeicao: string, novoTipo: string) {

        // Busca refeição específica no array de refeições do dia
        for (let refeicao = 0; refeicao <= diaObjeto.dia.refeicoes.length - 1; refeicao++) {
            if (Number(diaObjeto.dia.refeicoes[refeicao]._id) == Number(idRefeicao)) {

                // Atualiza o tipo da refeição
                diaObjeto.dia.refeicoes[refeicao].tipo = novoTipo

                // Sincroniza com banco (POST ou PUT)
                diaObjeto.postarOuEditar()
                return
            }
        }
    }
}

export default diaObjeto