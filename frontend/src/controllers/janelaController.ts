import NutryoFetch from "../utils/nutryoFetch.js";
import JanelaView from "../views/janelaView.js";
import AlimentoController from "./alimentoController.js";

class JanelaController {
    janelaView = new JanelaView();
    protected abasSelecionaveis: NodeListOf<Element>
    protected itemRefeicao: NodeListOf<Element>
    protected closeRefeicao: NodeListOf<Element>
    static controller: JanelaController;

    constructor() {
        this.adicionaEventosDeClick()
        JanelaController.controller = this;
    }

    protected adicionaEventosDeClick() {

        // # (Exclusivo mobile) Volta para o calendário ao clicar na data.

        var abaData = document.querySelector("#data-display") as HTMLElement

        if (!abaData?.classList.contains("hasEvent")){
            abaData.classList.add("hasEvent")

            abaData.addEventListener("click", ()=>{
                this.janelaView.esconderJanela()
            })
        }

        // # Evento responsável por alternar entre janelas ao clicar nelas

        // Armazena em this.abasSelecionaveis os elementos de aba que são clicaveis no DOM
        this.abasSelecionaveis = document.querySelectorAll(".abaSelecionavel");

        // Loop para evitar adição múltipla de listeners (Elementos que já tem um listener são desconsiderados)
        for (let i = 0; i <= this.abasSelecionaveis.length - 1; i++) {
            if (!this.abasSelecionaveis[i].classList.contains("hasEvent")) {
                this.abasSelecionaveis[i].classList.add("hasEvent");

                // Listener de click na aba
                this.abasSelecionaveis[i].addEventListener("click", (event) => {
                    event.stopPropagation();
                    // Armazena o elemento DOM clicado (no caso, a aba) em abaClicada 
                    var abaClicada = event.currentTarget as HTMLElement

                    // Chama função de view para selecionar a aba
                    this.janelaView.selecionaAba(abaClicada);

                    var alimentoController = new AlimentoController();
                    alimentoController.adicionaEventosDeClick()
                })
            }
        }

        // # Evento responsável por adicionar função ao 'x' e fechar abas abertas

        // Armazena em this.closeRefeicao os elementos de fechamento (No caso os "X" das abas) do DOM
        this.closeRefeicao = document.querySelectorAll(".refeicao-fechar")

        // Loop para evitar adição múltipla de listeners (Elementos que já tem um listener são desconsiderados)
        for (let i = 0; i <= this.closeRefeicao.length - 1; i++) {
            if (!this.closeRefeicao[i].classList.contains("hasEvent")) {
                this.closeRefeicao[i].classList.add("hasEvent")

                // Listener de click nos "X"
                this.closeRefeicao[i].addEventListener("click", (e) => {
                    e.stopPropagation()

                    // Armazena o elemento DOM clicado (no caso, o "X") em abaClicada
                    var abaClicada = e.currentTarget as HTMLElement

                    // Agora seleciona a aba relacionada ao "X" clicado, no caso, o elemento pai do "X" clicado
                    abaClicada = abaClicada.parentElement as HTMLElement

                    // Condicional: Se a aba a ser fechada for a aba selecionada, volta para a aba 0 (Aba refeições)
                    if (abaClicada.classList.contains("abaSelecionada")) {
                        this.janelaView.selecionaAba(this.abasSelecionaveis[0])
                    }

                    // Por fim, apaga a aba
                    this.janelaView.apagaAba(abaClicada)
                })
            }
        }
    }

   

    static criarElementosDeAlimento() {

    }
}

export default JanelaController;