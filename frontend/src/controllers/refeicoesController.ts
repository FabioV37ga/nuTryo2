import diaObjeto from "../utils/diaObjeto.js";
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

                    var tipo = document.querySelector(".refeicao-tipo") as HTMLElement
                    tipo.setAttribute("value", String(id))

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

                var alimentos = document.querySelector(".alimentos") as HTMLElement
                alimentos.style.display = "none"
                var tipo = document.querySelector(".refeicao-tipo") as HTMLElement
                tipo.children[1].children[0].textContent = "Selecione o tipo"
                
                var itens = document.querySelectorAll(".refeicao") as NodeListOf<HTMLElement>
                RefeicoesView._id = parseInt(itens[itens.length - 1].getAttribute("value") as string) + 1
                tipo.setAttribute("value", String(RefeicoesView._id))
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

        // var nutryoFetch = new NutryoFetch(diaObjeto.usuario)

        var intervalo = setInterval(() => {
     
            if (NutryoFetch.status == 1){
                var refeicoesDoDia = NutryoFetch.retornaRefeicoesDoDia(data) as any[]
                // console.log("aqui")
                // console.log(refeicoesDoDia)
                if (refeicoesDoDia){
                    for (let refeicao = 0; refeicao <= refeicoesDoDia.length - 1; refeicao++) {
                        this.criarElementosDeRefeicao(refeicoesDoDia[refeicao])
                    }
                }
                clearInterval(intervalo)
            }
        }, 1);


    }

    criarElementosDeRefeicao(refeicao: any) {
        // RefeicoesView._id = 1;
        // console.log("Caiu aqui. Adicionar refeicao:")
        // console.log(refeicao)
        this.refeicoesView.adicionarRefeicao(refeicao)
        this.adicionaEventosDeClick()
    }
}

export default RefeicoesController