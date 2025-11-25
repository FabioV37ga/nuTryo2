import { json } from "stream/consumers";
import CalendarioController from "../controllers/calendarioController.js";
import { backend } from "./connection.js";
import NutryoFetch from "./nutryoFetch.js";
import CalendarioView from "../views/calendarioView.js";

class diaObjeto {
    static diasSalvos: any[] = [];
    static dia: any = {};
    static refeicoes: any[] = [];
    static alimentos: object[] = []
    static usuario: string = '';


    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por postar um novo dia no banco de dados

    static async postarDiaBanco() {
        console.log("#diaObjeto !!! Requisição de post feita !!!")
        try {
            // Inicia requisição no backend
            var resposta = await fetch(`${backend}/refeicoes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(diaObjeto.dia)
            })
            // Faz nova requisição do backend para atualizar dados locais depois de ter postado o dia novo
            await NutryoFetch.nutryo.fetchDias(diaObjeto.usuario)

            console.log("#diaObjeto - post bem sucedido")
            console.log("#diaObjeto - Iniciando nova requisição de get com novos itens...")

            CalendarioView.adicionarEfeitosVisuais()
        } catch (error) {
            console.log("#diaObjeto - Erro no post")
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por fazer edições em dias salvos no banco de dados
    static async editarDiaBanco() {

        try {
            // Inicia requisição de edição de item
            const requisicao = await fetch(`${backend}/refeicoes/${diaObjeto.usuario}/${diaObjeto.dia.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(diaObjeto.dia)
            })
            
        } catch (error) {
            
        }
        // Ao fim da requisição de edição, faz nova requisição para buscar a lista de itens atualizada no banco
        await NutryoFetch.nutryo.fetchDias(diaObjeto.usuario)
        CalendarioView.adicionarEfeitosVisuais()
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por atualizar os objetos locais
    static atualizarDia(campo: string, local?: string, objeto?: any[] | any) {
        switch (campo) {

            // --------------------------------------------------------------------------------------------------------------------
            // Atualiza refeição local
            case "refeicao":
                // Adiciona objeto de refeição ao objeto dia
                diaObjeto.dia.refeicoes.push(objeto)

                // Logs
                // console.log("#diaObjeto - objeto atualizado (refeicoes)")
                // console.log(diaObjeto.dia)
                // console.log("-----------------------------------------------------------")
                break;

            // --------------------------------------------------------------------------------------------------------------------
            // Atualiza alimento especifico dentro do objeto local
            case "alimento":
                local = local ? local : "0";

                // primeiro localiza o alimento a ser atualizado a partir do LOCAL passado como parametro
                const alimentos = diaObjeto.dia.refeicoes[Number(local)].alimentos;
                const index = alimentos.findIndex((item: any) => item._id === objeto._id);

                // Faz atualização:
                if (index !== -1) {
                    // substitui o item no mesmo lugar, sem mudar a ordem
                    alimentos[index] = objeto;
                } else {
                    // se não existir, adiciona no final
                    alimentos.push(objeto);
                }

                // No final da atualização de um alimento, chama método para postar, ou editar se objeto já existir no banco.
                diaObjeto.postarOuEditar();

                // Logs
                // console.log("#diaObjeto - objeto atualizado (alimento)");
                // console.log(diaObjeto.dia);
                // console.log("-----------------------------------------------------------");
                break;
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por gerar um objeto de DIA a partir do corpo gerado pelos outros métodos
    static gerarDia(data: string, usuario: string, corpo: object[]) {
        // Inicializa objeto
        var objeto = {
            id: data,
            _usuario: diaObjeto.usuario,
            refeicoes: corpo
        }
        // Depois de gerar, pendura no atributo dia da classe
        diaObjeto.dia = objeto

        // Logs
        // console.log("#diaObjeto - Objeto dia gerado → " + CalendarioController.dataSelecionada)
        // if (NutryoFetch.retornaRefeicoesDoDia(CalendarioController.dataSelecionada)) {
        //     console.log("#diaObjeto - Objeto criado tem referência no banco")
        // } else {
        //     console.log("#diaObjeto - Objeto criado não tem referência no banco, iniciando com corpo vazio.")
        // }

        // console.log(diaObjeto.dia)
        // console.log("-----------------------------------------------------------")
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por gerar um objeto de refeição 
    static gerarRefeicao(id: number, tipo: string, alimentos: any[]) {

        // Define o atributo refeições da classe como objeto vazio
        diaObjeto.refeicoes = []

        // Define atributo alimentos da classe como objeto vazio
        diaObjeto.alimentos = []

        // Inicializa objeto de refeição
        var objeto = {
            _id: id,
            tipo: tipo,
            alimentos: alimentos
        }

        // Adiciona objeto de refeição criado
        diaObjeto.refeicoes.push(objeto)

        // Chama método para atualizar o dia com a refeição gerada
        diaObjeto.atualizarDia("refeicao", "", objeto)
        // Logs
        // console.log("#RefeicaoController - Refeição nova criada - id: " + id)
        // console.log(objeto)
        // console.log("#RefeicaoController - Refeições atualizadas → " + CalendarioController.dataSelecionada)
        // console.log("*Objeto dia ainda não atualizado")
        // console.log(diaObjeto.refeicoes)
        // console.log("-----------------------------------------------------------")
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por gerar um objeto de alimento
    static gerarAlimento(refeicao: string, id: string, nome: string, peso: number, calorias: number, proteinas: number, carboidratos: number, gorduras: number) {

        // Inicia objeto com os parametros passados
        var objeto = {
            _id: id,
            alimento: nome,
            peso: peso,
            calorias: calorias,
            proteinas: proteinas,
            carboidratos: carboidratos,
            gorduras: gorduras
        }

        // Adiciona objeto array de alimentos do objeto de dia local
        diaObjeto.alimentos.push(objeto)
        diaObjeto.atualizarDia("alimento", String(Number(refeicao) - 1), objeto)
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por apagar objetos de alimento dos objetos locais
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

        // Faz cópia do array de objetos de refeições locais
        var refeicoes = diaObjeto.dia.refeicoes

        // Inicializa array que será o array sem a refeição a ser apagada
        var refeicoesFinais: any[] = []

        // Adiciona itens de refeição, com excessão ao apagado
        for (let i = 0; i <= refeicoes.length - 1; i++) {
            if (
                Number(refeicoes[i]._id) != Number(refeicao)
            ) {
                refeicoesFinais.push(refeicoes[i])
            }
        }

        // Decrementa IDS maiores do que o ID a ser apagado em 1, isso garante a ordem crescente dos IDS de refeições da lista
        for (let i = 0; i <= refeicoesFinais.length - 1; i++) {
            if (Number(refeicoesFinais[i]._id) > Number(refeicao)) {
                refeicoesFinais[i]._id = String(Number(refeicoesFinais[i]._id) - 1)
            }
        }

        // Por fim, atualiza a lista de objetos de refeições locais
        diaObjeto.dia.refeicoes = refeicoesFinais

        // Chama função para postar ou editar
        diaObjeto.postarOuEditar()


        // Logs
        // console.log("#diaObjeto - refeição removida")
        // console.log(diaObjeto.dia)
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por editar o objeto de dia local
    static editarDia(data: string, corpo: object) {
        for (let i = 0; i <= diaObjeto.diasSalvos.length - 1; i++) {

            // Seleciona dia a ser editado
            if (diaObjeto.diasSalvos[i].Id == data) {
                // Define o corpo do dia (Refeicoes > alimentos)
                diaObjeto.diasSalvos[i] = corpo
            }
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por decidir se um item será postado no banco, ou se já existe no banco, editado.
    static postarOuEditar() {

        // Verifica se objeto já existe no banco de dados
        for (let i = 0; i <= diaObjeto.diasSalvos.length - 1; i++) {
            if (diaObjeto.dia.id == diaObjeto.diasSalvos[i].id) {

                // Se já existe, chama método para fazer edição do objeto
                diaObjeto.editarDiaBanco()
                return
            }
        }
        // Se não existe, chama método para fazer postagem do objeto.
        diaObjeto.postarDiaBanco()
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por editar o tipo de uma refeição nos objetos locais
    static editarTipoRefeicao(idRefeicao: string, novoTipo: string) {

        // Seleciona refeicao a ser editada no banco
        for (let refeicao = 0; refeicao <= diaObjeto.dia.refeicoes.length - 1; refeicao++) {
            if (Number(diaObjeto.dia.refeicoes[refeicao]._id) == Number(idRefeicao)) {

                // Troca o tipo a partir do argumento passado
                diaObjeto.dia.refeicoes[refeicao].tipo = novoTipo

                // Chama função para editar
                diaObjeto.postarOuEditar()
                return
            }
        }
    }
}

export default diaObjeto