import RefeicoesView from "../views/refeicoesView.js"
import JanelaController from "./janelaController.js";

class RefeicoesController extends JanelaController{
    private RefeicoesView = new RefeicoesView()

    constructor() {
        super()
        this.adicionaEventosDeClick()
    }

    protected adicionaEventosDeClick() {
        // Abre uma janela ao clicar em adicionar, ou editar uma refeição
        this.itemRefeicao = document.querySelectorAll(".refeicao")
        for (let i = 1; i <= this.itemRefeicao.length - 1; i++) {
            if (!this.itemRefeicao[i].classList.contains("hasEvent")) {
                this.itemRefeicao[i].classList.add("hasEvent")

                // adicionar ou editar
                this.itemRefeicao[i].children[0].addEventListener("click", (e) => {
                    
                    var titulo = this.itemRefeicao[i].textContent.toString().trim().split(" ")[0]
                    var id: number = Number(this.itemRefeicao[i].getAttribute("value"));
                    
                    var abaCriada = this.RefeicoesView.criaAba(titulo, id);

                    this.RefeicoesView.selecionaAba(abaCriada);

                    this.adicionaEventosDeClick()
                    super.adicionaEventosDeClick()
                })

                this.itemRefeicao[i].children[2].addEventListener("click", (e)=>{
                    var item = e.currentTarget as Element
                    this.RefeicoesView.removerRefeicao(item.parentElement as Element)
                })
            }
        }
    }
}

export default RefeicoesController