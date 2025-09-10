import diaObjeto from "../utils/diaObjeto.js";
import NutryoFetch from "../utils/nutryoFetch.js";
import RefeicaoView from "../views/refeicaoView.js";
import CalendarioController from "./calendarioController.js";

class RefeicaoController {
    private refeicaoView = new RefeicaoView()
    listaTipoLabel: Element;
    listaTipos: Element;
    listaTiposItem: NodeListOf<Element>;
    constructor() {
        this.listaTipoLabel = document.querySelector(".refeicao-tipo-tipoSelecionado") as Element;
        this.listaTipos = document.querySelector(".refeicao-tipo-list") as Element;
        this.listaTiposItem = document.querySelectorAll(".refeicao-tipo-list li") as NodeListOf<Element>;
        this.adicionaEventosDeClick()
    }

    private adicionaEventosDeClick() {

        // Abre a lista ao clicar no tipo selecionado
        // Previne adição multipla de eventos de click
        if (!this.listaTipoLabel.classList.contains("hasEvent")) {
            this.listaTipoLabel.classList.add("hasEvent")

            // Adiciona evento
            this.listaTipoLabel.addEventListener("click", (e) => {
                e.stopPropagation
                // Esconde/ mostra lista
                this.refeicaoView.toggleListaDeTipos()
            })
        }

        // Seleciona o tipo, e fecha a lista de tipos
        for (let i = 0; i <= this.listaTiposItem.length - 1; i++) {
            // Previne adição multipla de eventos de click
            if (!this.listaTiposItem[i].classList.contains("hasEvent")) {
                this.listaTiposItem[i].classList.add("hasEvent")

                this.listaTiposItem[i].addEventListener("click", (e) => {
                    e.stopPropagation
                    var elementoClicado = e.currentTarget as HTMLElement
                    this.refeicaoView.selecionaItem(elementoClicado)
                    this.refeicaoView.toggleListaDeTipos()

                    // Ao clicar no tipo da refeição, retorna refeição do banco de dados
                    var refeicao = NutryoFetch.retornaRefeicao(
                        CalendarioController.dataSelecionada,
                        elementoClicado.parentElement?.parentElement?.getAttribute("value") as string
                    )

                    // Se houver retorno do banco, apenas troca o tipo da refeição.
                    if (refeicao){
                        diaObjeto.editarTipoRefeicao(refeicao._id as string, elementoClicado.textContent)
                        // refeicao.tipo = elementoClicado.textContent
                        // Aqui vai precisar salvar
                    }
                    // Se não houver retorno do banco, significa que refeição não existe, e precisa ser criada.
                    else{
                        
                        diaObjeto.gerarRefeicao(
                           Number(elementoClicado.parentElement?.parentElement?.getAttribute("value") as string), 
                            elementoClicado.textContent,
                            []
                        )
                    }

                    var refeicaoAtual = document.querySelector(".abaSelecionada")?.getAttribute("value") as string
                    this.refeicaoView.trocaTipo(refeicaoAtual, elementoClicado.textContent)
                    // console.log("#RefeicaoController - Nova refeição criada")
                    // console.log(diaObjeto.diasSalvos)
                    // console.log(elementoClicado.textContent)
                })

            }
        }
    }

}

export default RefeicaoController