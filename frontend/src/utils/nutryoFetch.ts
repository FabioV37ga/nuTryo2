import { backend } from "../utils/connection.js"
import diaObjeto from "./diaObjeto.js";

class NutryoFetch {
    static objects: any[]
    static status = 0
    private user: string;

    constructor(user: string) {
        NutryoFetch.status = 0
        this.user = user
        this.fetchObjects(this.user)
        diaObjeto.usuario = this.user
    }

    private async fetchObjects(user: string) {

        // console.log(`${backend}/refeicoes/${user}`)
        try{
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
        }catch(error){

        }finally{
            NutryoFetch.status = 1
        }



        // let refeicoes = await resposta.json();
    }

    static retornaRefeicoesDoDia(data: string) {
        // console.log("teste!")
        // console.log(diaObjeto.diasSalvos)
        for (let dia = 0; dia <= diaObjeto.diasSalvos.length - 1; dia++) {
            if (diaObjeto.diasSalvos[dia]){
                // console.log(diaObjeto.diasSalvos[dia])
                if (data == diaObjeto.diasSalvos[dia]._id) {

                    return diaObjeto.diasSalvos[dia].refeicoes
                }
            }
        }
    }

    static retornaRefeicao(data: string, refeicao: string) {
        var refeicoes = NutryoFetch.retornaRefeicoesDoDia(data)
        if (refeicoes)
            for (let ref = 0; ref <= refeicoes.length - 1; ref++) {
                if (refeicoes[ref]._id == refeicao) {
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