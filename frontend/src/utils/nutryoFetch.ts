import { backend } from "../utils/connection.js"
import diaObjeto from "./diaObjeto.js";

class NutryoFetch {
    static objects: any[]
    static status = 0
    static username: string;
    private user: string;

    constructor(user: string, username?: string) {
        NutryoFetch.status = 0

        if (username) {
            NutryoFetch.username = username
            console.log(username)
        }

        this.user = user
        diaObjeto.usuario = this.user


        this.fetchObjects(this.user)
    }

    private async fetchObjects(user: string) {
        try {
            const resposta: any = await fetch(`${backend}/refeicoes/${user}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }

            })
            const data = await resposta.json()

            NutryoFetch.objects = data
            diaObjeto.diasSalvos = data

            console.log("#NutryoFetch - Dados coletados do usuário atual:")
            console.log(data)
            console.log("-----------------------------------------------------------")
        } catch (error) {

        } finally {
            NutryoFetch.status = 1
        }
    }

    static retornaRefeicoesDoDia(data: string) {
        for (let dia = 0; dia <= diaObjeto.diasSalvos.length - 1; dia++) {
            if (diaObjeto.diasSalvos[dia]) {
                if (data == diaObjeto.diasSalvos[dia].id) {

                    return diaObjeto.diasSalvos[dia].refeicoes
                }
            }
        }
    }

    static retornaRefeicao(data: string, refeicao: string) {
        var refeicoes = NutryoFetch.retornaRefeicoesDoDia(data)
        if (refeicoes)
            for (let ref = 0; ref <= refeicoes.length - 1; ref++) {
                if (Number(refeicoes[ref]._id) == Number(refeicao)) {
                    return refeicoes[ref]
                }
            }
    }

    static retornaAlimentosDaRefeicao(data: string, refeicao: string): object[] {
        var alimentos = NutryoFetch.retornaRefeicao(data, refeicao)
        var listaAlimentos: object[] = [];
        if (alimentos) {
            alimentos = alimentos.alimentos

            for (let alimento = 0; alimento <= alimentos.length - 1; alimento++) {
                listaAlimentos.push(alimentos[alimento])
            }

            console.log(listaAlimentos)
        }
        return listaAlimentos
    }
}

export default NutryoFetch