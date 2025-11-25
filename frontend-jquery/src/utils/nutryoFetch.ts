import { backend } from "../utils/connection.js"
import diaObjeto from "./diaObjeto.js";

class NutryoFetch {
    static nutryo:NutryoFetch;
    static objects: any[]
    static metas: any
    static status = 0
    static metaStatus = 0;
    static username: string;
    private user: string;

    constructor(user: string, username?: string) {
        // Define status como 0, esse atributo auxilia outros lugares do sistema a só executar trechos de lógica quando o status for 1 (Requisição completa)
        NutryoFetch.status = 0
        NutryoFetch.metaStatus = 0;

        // Se houver nome do usuário passado como parâmetro, define atributo usuário como o nome passado
        if (username) {
            NutryoFetch.username = username
            console.log(username)
        }

        // Define o user como o email passado como atributo em user
        this.user = user
        // Também define o email do objeto local
        diaObjeto.usuario = this.user

        // Faz busca dos dias com anotação do usuário a partir do email
        this.fetchDias(this.user)

        // Faz busca nas metas do usuário
        this.fetchMetas(this.user)

        NutryoFetch.nutryo = this
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por fazer busca no banco de dados pelas anotações do usuário logado
    async fetchDias(user: string) {
        try {
            // Inicia requisição
            const resposta: any = await fetch(`${backend}/refeicoes/${user}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }

            })
            const data = await resposta.json()

            // Salva resultado da requisição aqui (Essa parte é imutavel, serve de comparação)
            NutryoFetch.objects = data

            // Salva resultado da pesquisa nos objetos locais (Parte lógica, é aqui que as alterações são feitas antes de serem comparadas e enviadas para o banco de dados)
            diaObjeto.diasSalvos = data

            // Logs
            // console.log("#NutryoFetch - Dados coletados do usuário atual:")
            // console.log(data)
            // console.log("-----------------------------------------------------------")
            return data;
        } catch (error) {

        } finally {
            // Ao fim da requisição, marca status como 1 (Requisição completa)
            NutryoFetch.status = 1
        }
    }

    async fetchMetas(user: string){
        try{
            const resposta: any = await fetch(`${backend}/metas/${user}`,{
                method: "GET",
                headers:{
                    "Content-Type": "application/json"
                }
            });

            const data = await resposta.json();

            NutryoFetch.metas = data[0];
        }catch(err){

        }finally{
            NutryoFetch.metaStatus = 1;
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por retornar os objetos de refeição do dia passado como parâmetro
    static retornaRefeicoesDoDia(data: string) {
        // Busca o dia nos objetos locais
        for (let dia = 0; dia <= diaObjeto.diasSalvos.length - 1; dia++) {

            // Se encontrado, retorna os objetos 
            if (diaObjeto.diasSalvos[dia]) {
                if (data == diaObjeto.diasSalvos[dia].id) {
                    return diaObjeto.diasSalvos[dia].refeicoes
                }
            }
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por retornar uma refeição especifica a partir da data e ID da refeição (passadas como parâmetro)
    static retornaRefeicao(data: string, refeicao: string) {
        
        // Primeiro pega todas as refeições do dia passado como parametro
        var refeicoes = NutryoFetch.retornaRefeicoesDoDia(data)

        // Se houverem refeições no dia...
        if (refeicoes)
            // Retorna a refeição especifica
            for (let ref = 0; ref <= refeicoes.length - 1; ref++) {
                if (Number(refeicoes[ref]._id) == Number(refeicao)) {
                    return refeicoes[ref]
                }
            }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por retornar alimentos de uma refeição específica de um dia específico
    static retornaAlimentosDaRefeicao(data: string, refeicao: string): object[] {

        // Primeiro retorna uma refeição especifica a partir da data e ID
        var alimentos = NutryoFetch.retornaRefeicao(data, refeicao)

        // Inicializa objeto de alimentos vazio
        var listaAlimentos: object[] = [];

        // Se houverem alimentos na refeição referenciada...
        if (alimentos) {

            // Guarda eles na variavel alimentos
            alimentos = alimentos.alimentos

            // Coloca esses alimentos no objeto inicializado anteriormente
            for (let alimento = 0; alimento <= alimentos.length - 1; alimento++) {
                listaAlimentos.push(alimentos[alimento])
            }
        }
        // Retorna lista de alimentos da refeição
        return listaAlimentos
    }
}

export default NutryoFetch