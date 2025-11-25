var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { backend } from "../utils/connection.js";
import diaObjeto from "./diaObjeto.js";
class NutryoFetch {
    constructor(user, username) {
        NutryoFetch.status = 0;
        NutryoFetch.metaStatus = 0;
        if (username) {
            NutryoFetch.username = username;
            console.log(username);
        }
        this.user = user;
        diaObjeto.usuario = this.user;
        this.fetchDias(this.user);
        this.fetchMetas(this.user);
        NutryoFetch.nutryo = this;
    }
    fetchDias(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resposta = yield fetch(`${backend}/refeicoes/${user}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = yield resposta.json();
                NutryoFetch.objects = data;
                diaObjeto.diasSalvos = data;
                return data;
            }
            catch (error) {
            }
            finally {
                NutryoFetch.status = 1;
            }
        });
    }
    fetchMetas(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resposta = yield fetch(`${backend}/metas/${user}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = yield resposta.json();
                NutryoFetch.metas = data[0];
            }
            catch (err) {
            }
            finally {
                NutryoFetch.metaStatus = 1;
            }
        });
    }
    static retornaRefeicoesDoDia(data) {
        for (let dia = 0; dia <= diaObjeto.diasSalvos.length - 1; dia++) {
            if (diaObjeto.diasSalvos[dia]) {
                if (data == diaObjeto.diasSalvos[dia].id) {
                    return diaObjeto.diasSalvos[dia].refeicoes;
                }
            }
        }
    }
    static retornaRefeicao(data, refeicao) {
        var refeicoes = NutryoFetch.retornaRefeicoesDoDia(data);
        if (refeicoes)
            for (let ref = 0; ref <= refeicoes.length - 1; ref++) {
                if (Number(refeicoes[ref]._id) == Number(refeicao)) {
                    return refeicoes[ref];
                }
            }
    }
    static retornaAlimentosDaRefeicao(data, refeicao) {
        var alimentos = NutryoFetch.retornaRefeicao(data, refeicao);
        var listaAlimentos = [];
        if (alimentos) {
            alimentos = alimentos.alimentos;
            for (let alimento = 0; alimento <= alimentos.length - 1; alimento++) {
                listaAlimentos.push(alimentos[alimento]);
            }
        }
        return listaAlimentos;
    }
}
NutryoFetch.status = 0;
NutryoFetch.metaStatus = 0;
export default NutryoFetch;
