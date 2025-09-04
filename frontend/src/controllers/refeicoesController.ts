import RefeicoesView from "../views/refeicoesView.js"
import JanelaController from "./janelaController.js";

class RefeicoesController extends JanelaController {
    refeicoesView;
    private botaoAdicionarRefeicao: Element;

    constructor() {
        super()
        this.refeicoesView = new RefeicoesView();
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

                    var titulo = this.itemRefeicao[i].textContent.toString().trim().split(" ")[0]
                    var id: number = Number(this.itemRefeicao[i].getAttribute("value"));

                    var abaCriada = this.refeicoesView.criaAba(titulo, id);

                    this.refeicoesView.selecionaAba(abaCriada);

                    // console.log(this.refeicoesView)

                    this.adicionaEventosDeClick()
                    super.adicionaEventosDeClick()

                    async function testaBanco() {
                        const resposta = await fetch("http://localhost:3001/refeicoes", {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })
                        let refeicoes = await resposta.json();
                        console.log(refeicoes)
                    }
                    testaBanco()
                })

                this.itemRefeicao[i].children[2].addEventListener("click", (e) => {
                    var item = e.currentTarget as Element
                    this.refeicoesView.removerRefeicao(item.parentElement as Element)
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
}

export default RefeicoesController