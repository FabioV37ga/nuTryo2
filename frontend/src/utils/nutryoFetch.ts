import { backend } from "./connection";
import diaObjeto from "./diaObjeto";

class NutryoFetch {
    static objects: any[] = [];
    static metas: any;
    static username: string = '';
    static email: string = '';


    static async iniciar(email: string, nome?: string) {
        NutryoFetch.username = nome ? nome : '';
        NutryoFetch.email = email;

        return await NutryoFetch.fetchDias(email);
        // NutryoFetch.fetchMetas(email);
    }

    static async fetchDias(email: string) {
        const resposta = await fetch(`${backend}/refeicoes/${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await resposta.json();

        NutryoFetch.objects = data;

        diaObjeto.diasSalvos = data;

        return data;
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por retornar os objetos de refeição do dia passado como parâmetro
    static retornaRefeicoesDoDia(data: string) {
        console.log("Buscando refeições do dia: " + data);
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

export default NutryoFetch;