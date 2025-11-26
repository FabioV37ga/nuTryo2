var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { backend } from "./connection.js";
import NutryoFetch from "./nutryoFetch.js";
import CalendarioView from "../views/calendarioView.js";
class diaObjeto {
    static postarDiaBanco() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("#diaObjeto !!! Requisição de post feita !!!");
            try {
                var resposta = yield fetch(`${backend}/refeicoes`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(diaObjeto.dia)
                });
                yield NutryoFetch.nutryo.fetchDias(diaObjeto.usuario);
                console.log("#diaObjeto - post bem sucedido");
                console.log("#diaObjeto - Iniciando nova requisição de get com novos itens...");
                CalendarioView.adicionarEfeitosVisuais();
            }
            catch (error) {
                console.log("#diaObjeto - Erro no post");
            }
        });
    }
    static editarDiaBanco() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requisicao = yield fetch(`${backend}/refeicoes/${diaObjeto.usuario}/${diaObjeto.dia.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(diaObjeto.dia)
                });
            }
            catch (error) {
            }
            yield NutryoFetch.nutryo.fetchDias(diaObjeto.usuario);
            CalendarioView.adicionarEfeitosVisuais();
        });
    }
    static atualizarDia(campo, local, objeto) {
        switch (campo) {
            case "refeicao":
                diaObjeto.dia.refeicoes.push(objeto);
                break;
            case "alimento":
                local = local ? local : "0";
                const alimentos = diaObjeto.dia.refeicoes[Number(local)].alimentos;
                const index = alimentos.findIndex((item) => item._id === objeto._id);
                if (index !== -1) {
                    alimentos[index] = objeto;
                }
                else {
                    alimentos.push(objeto);
                }
                diaObjeto.postarOuEditar();
                break;
        }
    }
    static gerarDia(data, usuario, corpo) {
        var objeto = {
            id: data,
            _usuario: diaObjeto.usuario,
            refeicoes: corpo
        };
        diaObjeto.dia = objeto;
    }
    static gerarRefeicao(id, tipo, alimentos) {
        diaObjeto.refeicoes = [];
        diaObjeto.alimentos = [];
        var objeto = {
            _id: id,
            tipo: tipo,
            alimentos: alimentos
        };
        diaObjeto.refeicoes.push(objeto);
        diaObjeto.atualizarDia("refeicao", "", objeto);
    }
    static gerarAlimento(refeicao, id, nome, peso, calorias, proteinas, carboidratos, gorduras) {
        var objeto = {
            _id: id,
            alimento: nome,
            peso: peso,
            calorias: calorias,
            proteinas: proteinas,
            carboidratos: carboidratos,
            gorduras: gorduras
        };
        diaObjeto.alimentos.push(objeto);
        diaObjeto.atualizarDia("alimento", String(Number(refeicao) - 1), objeto);
    }
    static apagarAlimento(refeicao, alimento) {
        var alimentos = diaObjeto.dia.refeicoes[Number(refeicao) - 1].alimentos;
        var alimentosFinal = [];
        for (let i = 0; i <= alimentos.length - 1; i++) {
            if (Number(alimentos[i]._id) != Number(alimento))
                alimentosFinal.push(alimentos[i]);
        }
        for (let i = 0; i <= alimentosFinal.length - 1; i++) {
            if (Number(alimentosFinal[i]._id) > Number(alimento)) {
                alimentosFinal[i]._id = String(Number(alimentosFinal[i]._id) - 1);
            }
        }
        diaObjeto.dia.refeicoes[Number(refeicao) - 1].alimentos = alimentosFinal;
        diaObjeto.postarOuEditar();
    }
    static apagarRefeicao(refeicao) {
        var refeicoes = diaObjeto.dia.refeicoes;
        var refeicoesFinais = [];
        for (let i = 0; i <= refeicoes.length - 1; i++) {
            if (Number(refeicoes[i]._id) != Number(refeicao)) {
                refeicoesFinais.push(refeicoes[i]);
            }
        }
        for (let i = 0; i <= refeicoesFinais.length - 1; i++) {
            if (Number(refeicoesFinais[i]._id) > Number(refeicao)) {
                refeicoesFinais[i]._id = String(Number(refeicoesFinais[i]._id) - 1);
            }
        }
        diaObjeto.dia.refeicoes = refeicoesFinais;
        diaObjeto.postarOuEditar();
    }
    static editarDia(data, corpo) {
        for (let i = 0; i <= diaObjeto.diasSalvos.length - 1; i++) {
            if (diaObjeto.diasSalvos[i].Id == data) {
                diaObjeto.diasSalvos[i] = corpo;
            }
        }
    }
    static postarOuEditar() {
        for (let i = 0; i <= diaObjeto.diasSalvos.length - 1; i++) {
            if (diaObjeto.dia.id == diaObjeto.diasSalvos[i].id) {
                diaObjeto.editarDiaBanco();
                return;
            }
        }
        diaObjeto.postarDiaBanco();
    }
    static editarTipoRefeicao(idRefeicao, novoTipo) {
        for (let refeicao = 0; refeicao <= diaObjeto.dia.refeicoes.length - 1; refeicao++) {
            if (Number(diaObjeto.dia.refeicoes[refeicao]._id) == Number(idRefeicao)) {
                diaObjeto.dia.refeicoes[refeicao].tipo = novoTipo;
                diaObjeto.postarOuEditar();
                return;
            }
        }
    }
}
diaObjeto.diasSalvos = [];
diaObjeto.dia = {};
diaObjeto.refeicoes = [];
diaObjeto.alimentos = [];
diaObjeto.usuario = '';
export default diaObjeto;
