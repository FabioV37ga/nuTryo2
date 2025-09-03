import JanelaView from "../views/janelaView.js";
class JanelaController {
    private janelaView = new JanelaView();
    private abas: NodeListOf<Element>
    private itemRefeicao: NodeListOf<Element>
    private closeRefeicao: NodeListOf<Element>

    constructor() {
        this.adicionaEventosDeClick()
    }

    adicionaEventosDeClick() {
        // Abre uma janela ao clicar em adicionar, ou editar uma refeição
        this.itemRefeicao = document.querySelectorAll(".refeicao")
        for (let i = 1; i <= this.itemRefeicao.length - 1; i++) {
            if (!this.itemRefeicao[i].classList.contains("hasEvent")) {
                this.itemRefeicao[i].classList.add("hasEvent")
                this.itemRefeicao[i].children[0].addEventListener("click", () => {
                    // console.log("aqui")
                    var titulo = this.itemRefeicao[i].textContent.toString().trim().split(" ")[0]
                    var id: number = Number(this.itemRefeicao[i].getAttribute("value"));
                    console.log(id)
                    this.janelaView.criaAba(titulo, id);
                    this.janelaView.selecionaAba(id);
                    this.adicionaEventosDeClick()
                })
            }
        }

        // Evento responsável por alternar entre janelas ao clicar nelas
        this.abas = document.querySelectorAll(".abaSelecionavel");
        for (let i = 0; i <= this.abas.length - 1; i++) {
            if (!this.abas[i].classList.contains("hasEvent")) {
                this.abas[i].classList.add("hasEvent");
                this.abas[i].addEventListener("click", (event) => {
                    event.stopPropagation();
                    var id: number = Number(this.abas[i].getAttribute("value"));
                    console.log(id)
                    this.janelaView.selecionaAba(id);

                })
            }
        }

        // Evento responsável por adicionar função ao 'x' e fechar abas abertas
        this.closeRefeicao = document.querySelectorAll(".refeicao-fechar")
        for (let i = 0; i <= this.closeRefeicao.length - 1; i++) {
            if (!this.closeRefeicao[i].classList.contains("hasEvent")) {
                this.closeRefeicao[i].classList.add("hasEvent")
                this.closeRefeicao[i].addEventListener("click", (e) => {
                    e.stopPropagation()
                    console.log(this.closeRefeicao[i].parentElement)
                    if (this.closeRefeicao[i].parentElement?.classList.contains("abaSelecionada")){
                        this.janelaView.selecionaAba(0)
                    }
                    this.closeRefeicao[i].parentElement?.remove()
                })
            }
        }
    }
}

export default JanelaController;