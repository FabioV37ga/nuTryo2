import NutryoFetch from "../utils/nutryoFetch.js";
import AlimentoView from "../views/alimentoView.js";
import RefeicoesView from "../views/refeicoesView.js"
import AlimentoController from "./alimentoController.js";
import CalendarioController from "./calendarioController.js";
import JanelaController from "./janelaController.js";

class RefeicoesController extends JanelaController {
    refeicoesView: RefeicoesView = new RefeicoesView();
    refeicoesNaJanela: any[] = [];
    private botaoAdicionarRefeicao: Element;

    constructor() {
        super()
        this.adicionaEventosDeClick()
    }

    protected adicionaEventosDeClick() {
        this.itemRefeicao = document.querySelectorAll(".refeicao")

        // Abre uma janela ao clicar em adicionar, ou editar uma refeição
        for (let i = 1; i <= this.itemRefeicao.length - 1; i++) {
            if (!this.itemRefeicao[i].classList.contains("hasEvent")) {
                this.itemRefeicao[i].classList.add("hasEvent")

                // adicionar ou editar
                this.itemRefeicao[i].children[0].addEventListener("click", (e) => {
                    e.stopPropagation
                    var elementoClicado = e.currentTarget as HTMLElement

                    var titulo = this.itemRefeicao[i].textContent.toString().trim().split(" ")[0]
                    var id: number = Number(this.itemRefeicao[i].getAttribute("value"));

                    var abaCriada = this.refeicoesView.criaAba(titulo, id);

                    this.refeicoesView.selecionaAba(abaCriada);

                    console.log(this.refeicoesNaJanela)
                    for (let ref = 0; ref <= this.refeicoesNaJanela.length - 1; ref++) {
                        // console.log(this.refeicoesNaJanela[ref]._id)
                        if (this.refeicoesNaJanela[ref]._id == elementoClicado.parentElement?.getAttribute("value")) {
                            // console.log(this.refeicoesNaJanela[ref].alimentos[0])
                            for (let ali = 0; ali <= this.refeicoesNaJanela[ref].alimentos.length - 1; ali++) {
                                var alimentoController: AlimentoController = new AlimentoController()
                                alimentoController.criarElementosDeAlimento(this.refeicoesNaJanela[ref].alimentos[ali])
                                // alimentoController.adicionarEventosDeClick()
                            }
                            // for (let ali = 0; ali <= this.refeicoesNaJanela[ref].alimentos.length - 1; ali++) {
                            //     this.criarElementosDeAlimento(this.refeicoesNaJanela[ref].alimento[ali])
                            // }
                        }
                    }
                    this.adicionaEventosDeClick()
                    super.adicionaEventosDeClick()
                })

                this.itemRefeicao[i].children[2].addEventListener("click", (e) => {
                    var item = e.currentTarget as Element
                    this.refeicoesView.removerRefeicao(item.parentElement as Element)
                })
            }
        }

        // # Cria elementos de refeição ao clicar no dia do calendário
        var dias = document.querySelectorAll(".dia")
        for (let i = 0; i <= dias.length - 1; i++) {
            if (!dias[i].classList.contains("hasWindowEvent")) {
                dias[i].classList.add("hasWindowEvent")

                dias[i].addEventListener("click", () => {
                    this.criarElementosDoDia(CalendarioController.dataSelecionada)
                })
            }
        }



        this.botaoAdicionarRefeicao = document.querySelector(".botao-adicionar-refeicao") as Element
        if (!this.botaoAdicionarRefeicao.classList.contains("hasEvent")) {
            this.botaoAdicionarRefeicao.classList.add("hasEvent")
            this.botaoAdicionarRefeicao.addEventListener("click", () => {
                this.refeicoesView.adicionarRefeicao()
                this.adicionaEventosDeClick()
            })
        }
    }

    criarElementosDoDia(data: string) {

        var refeicoesNoDOM = document.querySelectorAll(".refeicao")

        for (let refeicaoDOM = 1; refeicaoDOM <= refeicoesNoDOM.length - 1; refeicaoDOM++) {
            refeicoesNoDOM[refeicaoDOM].remove()
        }

        var refeicoesDoUsuario = NutryoFetch.objects

        for (let i = 0; i <= refeicoesDoUsuario.length - 1; i++) {

            if (data == refeicoesDoUsuario[i]._id) {

                // Refeições → alimentos
                for (var refeicao = 0; refeicao <= refeicoesDoUsuario[i].refeicoes.length - 1; refeicao++) {

                    // Cria elementos de refeições
                    // console.log(`A refeição ${refeicao} tem os seguintes alimentos:`)
                    this.refeicoesNaJanela.push(refeicoesDoUsuario[i].refeicoes[refeicao])
                    this.criarElementosDeRefeicao(refeicoesDoUsuario[i].refeicoes[refeicao])

                    for (var alimento = 0; alimento <= refeicoesDoUsuario[i].refeicoes[refeicao].alimentos.length - 1; alimento++) {

                        // var alimentoAtual = refeicoesDoUsuario[i].refeicoes[refeicao].alimentos[alimento]
                        // Cria elementos de alimentos
                        // this.criarElementosDeAlimento(refeicao)
                        // console.log(`Alimento ${alimento}:`)
                        // console.log(alimentoAtual[alimento])
                        // console.log(refeicoesDoUsuario[i].refeicoes[refeicao])
                    }
                }
                // console.log(i)
                return
            }
        }
    }

    criarElementosDeRefeicao(refeicao: any) {
        this.refeicoesView.adicionarRefeicao(refeicao)
        this.adicionaEventosDeClick()
    }
}

export default RefeicoesController