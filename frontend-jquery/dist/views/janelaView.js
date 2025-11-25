import AlimentoController from "../controllers/alimentoController.js";
import CalendarioController from "../controllers/calendarioController.js";
import RefeicoesController from "../controllers/refeicoesController.js";
import diaObjeto from "../utils/diaObjeto.js";
import NutryoFetch from "../utils/nutryoFetch.js";
import AlimentoView from "./alimentoView.js";
import RefeicoesView from "./refeicoesView.js";
class JanelaView {
    criaAba(titulo, id) {
        const elementoAba = `<a class="aba abaSelecionavel refeicao-aba" value="${id}">
                    <div class="refeicao-label">${titulo}</div>
                    <span class="refeicao-fechar">
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </span>
                </a>`;
        const elementosAbaDOM = document.querySelectorAll(".refeicao-aba");
        if (elementosAbaDOM && elementosAbaDOM.length > 0) {
            for (let i = 0; i <= elementosAbaDOM.length - 1; i++) {
                if (Number(elementosAbaDOM[i].getAttribute("value")) == id) {
                    break;
                }
                if (i == elementosAbaDOM.length - 1) {
                    $(".janela-abas").append(elementoAba);
                }
            }
        }
        else {
            $(".janela-abas").append(elementoAba);
        }
        var elementoDOMCriado = document.querySelectorAll(".abaSelecionavel");
        this.estilizaAbasAdicionais();
        return elementoDOMCriado[elementoDOMCriado.length - 1];
    }
    selecionaAba(aba) {
        const abasSelecionaveis = document.querySelectorAll(".abaSelecionavel");
        for (let i = 0; i <= abasSelecionaveis.length - 1; i++) {
            abasSelecionaveis[i].classList.remove("abaSelecionada");
        }
        aba.classList.add("abaSelecionada");
        var nutryoFetch = new NutryoFetch(diaObjeto.usuario);
        var itensDeAlimento = document.querySelectorAll(".alimento-item");
        for (let i = 1; i <= itensDeAlimento.length - 1; i++) {
            AlimentoView.apagarAlimento(itensDeAlimento[i]);
        }
        if (aba.classList.contains("abaRefeicoes")) {
            RefeicoesView._id = 1;
            this.mostrarConteudoAba("refeicoes");
            var refeicoesController = new RefeicoesController();
            refeicoesController.criarElementosDoDia(CalendarioController.dataSelecionada);
            if (itensDeAlimento)
                for (let i = 1; i <= itensDeAlimento.length - 1; i++) {
                    AlimentoView.apagarAlimento(itensDeAlimento[i]);
                }
        }
        else {
            this.mostrarConteudoAba("refeicao");
            var intervalo = setInterval(() => {
                if (NutryoFetch.status == 1) {
                    if (itensDeAlimento)
                        for (let i = 1; i <= itensDeAlimento.length - 1; i++) {
                            AlimentoView.apagarAlimento(itensDeAlimento[i]);
                        }
                    var alimentoController = new AlimentoController();
                    var alimentos = NutryoFetch.retornaAlimentosDaRefeicao(CalendarioController.dataSelecionada, aba.getAttribute("value"));
                    var refeicao = NutryoFetch.retornaRefeicao(CalendarioController.dataSelecionada, aba.getAttribute("value"));
                    if (alimentos) {
                        for (let i = 0; i <= alimentos.length - 1; i++) {
                            alimentoController.criarElementosDeAlimento(alimentos[i]);
                        }
                        if (refeicao) {
                            var listlabel = document.querySelector(".refeicao-tipo-tipoSelecionado-label");
                            listlabel.textContent = refeicao.tipo;
                            var alimentosAdicionados = document.querySelector(".alimentos");
                            alimentosAdicionados.style.display = "flex";
                        }
                    }
                    clearInterval(intervalo);
                }
            }, 1);
        }
        return aba;
    }
    apagaAba(aba) {
        aba.remove();
        this.estilizaAbasAdicionais();
    }
    apagaTodasAbas() {
        var abas = document.querySelectorAll(".abaSelecionavel");
        for (let i = 1; i <= abas.length - 1; i++) {
            abas[i].remove();
        }
    }
    mostrarConteudoAba(tipo) {
        const conteudoRefeicoes = document.querySelector(".refeicoes-conteudo");
        const conteudoRefeicao = document.querySelector(".refeicao-conteudo");
        switch (tipo) {
            case "refeicoes":
                conteudoRefeicao.style.display = "none";
                conteudoRefeicoes.style.display = "flex";
                break;
            case "refeicao":
                conteudoRefeicoes.style.display = "none";
                conteudoRefeicao.style.display = "flex";
                break;
        }
    }
    estilizaAbasAdicionais() {
        var elementoDOMCriado = document.querySelectorAll(".abaSelecionavel");
        for (let i = 0; i <= elementoDOMCriado.length - 1; i++) {
            elementoDOMCriado[i].classList.remove("abaExtraFinal");
        }
        if (window.innerWidth > 985) {
            if (elementoDOMCriado.length >= 5) {
                elementoDOMCriado[elementoDOMCriado.length - 1].classList.add("abaExtraFinal");
            }
        }
        else {
            if (elementoDOMCriado.length >= 3)
                elementoDOMCriado[elementoDOMCriado.length - 1].classList.add("abaExtraFinal");
        }
    }
    esconderJanela() {
        var janela = document.querySelector(".janela");
        janela.style.display = 'none';
    }
}
export default JanelaView;
