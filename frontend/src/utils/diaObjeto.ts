import { json } from "stream/consumers";
import CalendarioController from "../controllers/calendarioController.js";
import { backend } from "./connection.js";
import NutryoFetch from "./nutryoFetch.js";

class diaObjeto {
    static diasSalvos: any[] = [];
    static dia: any = {};
    static refeicoes: any[] = [];
    static alimentos: object[] = []
    static usuario: string = '';

    static async postarDiaBanco() {
        console.log("#diaObjeto !!! Requisição de post feita !!!")
        try {
            var resposta = await fetch(`${backend}/refeicoes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(diaObjeto.dia)
            })
            console.log("#diaObjeto - post bem sucedido")

            console.log("#diaObjeto - Iniciando nova requisição de get com novos itens...")
            var nutryoFetch = new NutryoFetch(diaObjeto.usuario)
        } catch (error) {
            console.log("#diaObjeto - Erro no post")
        }
    }

    static atualizarDia(campo: string, local?: string, objeto?: any[] | any) {
        switch (campo) {

            case "refeicao":

                diaObjeto.dia.refeicoes.push(objeto)

                console.log("#diaObjeto - objeto atualizado (refeicoes)")
                console.log(diaObjeto.dia)
                console.log("-----------------------------------------------------------")
                break;


            case "alimento":
                local = local ? local : "0";

                const alimentos = diaObjeto.dia.refeicoes[Number(local)].alimentos;
                const index = alimentos.findIndex((item: any) => item._id === objeto._id);

                if (index !== -1) {
                    // substitui o item no mesmo lugar, sem mudar a ordem
                    alimentos[index] = objeto;
                } else {
                    // se não existir, adiciona no final
                    alimentos.push(objeto);
                }

                console.log("#diaObjeto - objeto atualizado (alimento)");
                console.log(diaObjeto.dia);
                console.log("-----------------------------------------------------------");

                diaObjeto.postarOuEditar();
                break;

        }
        diaObjeto.refeicoes
    }

    static gerarDia(data: string, usuario: string, corpo: object[]) {
        var objeto = {
            _id: data,
            _usuario: diaObjeto.usuario,
            refeicoes: corpo
        }
        diaObjeto.dia = objeto
        console.log("#diaObjeto - Objeto dia gerado → " + CalendarioController.dataSelecionada)
        if (NutryoFetch.retornaRefeicoesDoDia(CalendarioController.dataSelecionada)) {
            console.log("#diaObjeto - Objeto criado tem referência no banco")
        } else {
            console.log("#diaObjeto - Objeto criado não tem referência no banco, iniciando com corpo vazio.")
        }

        console.log(diaObjeto.dia)
        console.log("-----------------------------------------------------------")
        // diaObjeto.postarDia()
    }

    static gerarRefeicao(id: number, tipo: string, alimentos: any[]) {
        diaObjeto.refeicoes = []
        diaObjeto.alimentos = []
        var objeto = {
            _id: id,
            tipo: tipo,
            alimentos: alimentos
        }
        diaObjeto.refeicoes.push(objeto)
        console.log("#RefeicaoController - Refeição nova criada - id: " + id)
        console.log(objeto)
        console.log("#RefeicaoController - Refeições atualizadas → " + CalendarioController.dataSelecionada)
        console.log("*Objeto dia ainda não atualizado")
        console.log(diaObjeto.refeicoes)
        console.log("-----------------------------------------------------------")
        diaObjeto.atualizarDia("refeicao", "", objeto)
    }

    static gerarAlimento(refeicao: string, id: string, nome: string, peso: number, calorias: number, proteinas: number, carboidratos: number, gorduras: number) {
        // console.log("temp | refeicao: " + refeicao)
        var objeto = {
            _id: id,
            alimento: nome,
            peso: peso,
            calorias: calorias,
            proteinas: proteinas,
            carboidratos: carboidratos,
            gorduras: gorduras
        }
        diaObjeto.alimentos.push(objeto)
        // diaObjeto.refeicoes[Number(refeicao) - 1].alimentos.push(objeto)
        diaObjeto.atualizarDia("alimento", String(Number(refeicao) - 1), objeto)
        // diaObjeto.gerarDia(
        //     CalendarioController.dataSelecionada,
        //     diaObjeto.usuario,
        //     diaObjeto.refeicoes
        // )
        // console.log(diaObjeto.refeicoes)
    }

    static apagarAlimento(refeicao: string, alimento: string) {
        var alimentos = diaObjeto.dia.refeicoes[Number(refeicao) - 1].alimentos
        console.log(alimentos)
        var alimentosFinal: any[] = []
        for (let i = 0; i <= alimentos.length - 1; i++) {
            // console.log("antes: " + alimentos[i]._id + ", depois: " + Number(alimento))
            if (Number(alimentos[i]._id) != Number(alimento))
                alimentosFinal.push(alimentos[i])
        }

        for (let i = 0; i <= alimentosFinal.length - 1; i++) {
            if (Number(alimentosFinal[i]._id) > Number(alimento)) {
                alimentosFinal[i]._id = String(Number(alimentosFinal[i]._id) - 1)
            }
        }


        console.log(alimentosFinal)


        diaObjeto.dia.refeicoes[Number(refeicao) - 1].alimentos = alimentosFinal

        console.log("#diaObjeto - alimento removido")
        console.log(diaObjeto.dia)

        diaObjeto.postarOuEditar()
    }

    static apagarRefeicao(refeicao: string) {
        var refeicoes = diaObjeto.dia.refeicoes
        // console.log(refeicoes)
        var refeicoesFinais: any[] = []

        for (let i = 0; i <= refeicoes.length - 1; i++) {
            if (
                Number(refeicoes[i]._id) != Number(refeicao)
            ) {
                refeicoesFinais.push(refeicoes[i])
            }
        }

        for (let i = 0; i <= refeicoesFinais.length - 1; i++) {
            if (Number(refeicoesFinais[i]._id) > Number(refeicao)) {
                refeicoesFinais[i]._id = String(Number(refeicoesFinais[i]._id) - 1)
            }
        }

        console.log(refeicoesFinais)

        diaObjeto.dia.refeicoes = refeicoesFinais

        console.log("#diaObjeto - refeição removida")
        console.log(diaObjeto.dia)

        diaObjeto.postarOuEditar()
    }

    static reiniciar() {
        diaObjeto.dia = {}
        diaObjeto.refeicoes = []
        diaObjeto.alimentos = []
    }

    static editarDia(data: string, corpo: object) {
        // Seleciona dia a ser editado
        for (let i = 0; i <= diaObjeto.diasSalvos.length - 1; i++) {
            if (diaObjeto.diasSalvos[i]._Id == data) {
                diaObjeto.diasSalvos[i] = corpo
            }
        }
    }

    static postarOuEditar() {
        for (let i = 0; i <= diaObjeto.diasSalvos.length - 1; i++) {
            if (diaObjeto.dia._id == diaObjeto.diasSalvos[i]._id) {
                diaObjeto.editarDiaBanco()
                return
            }
        }
        diaObjeto.postarDiaBanco()
    }

    static async editarDiaBanco() {
        console.log("Já existe, não postar, editar.")
        try {
            const requisicao = await fetch(`${backend}/refeicoes/${diaObjeto.usuario}/${diaObjeto.dia._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(diaObjeto.dia)
            })
        } catch (error) {

        }
        new NutryoFetch(diaObjeto.usuario)
    }

    static editarTipoRefeicao(idRefeicao: string, novoTipo: string) {
        // Seleciona refeicao a ser editada no banco
        // Loop Dia

        for (let refeicao = 0; refeicao <= diaObjeto.dia.refeicoes.length - 1; refeicao++) {
            if (Number(diaObjeto.dia.refeicoes[refeicao]._id) == Number(idRefeicao)) {
                console.log("editar refeicao")
                console.log(diaObjeto.dia.refeicoes[refeicao])
                diaObjeto.dia.refeicoes[refeicao].tipo = novoTipo
                console.log("refeicao editada:")
                console.log(diaObjeto.dia.refeicoes[refeicao])

                diaObjeto.postarOuEditar()
                return
            }
        }


    }
}

export default diaObjeto