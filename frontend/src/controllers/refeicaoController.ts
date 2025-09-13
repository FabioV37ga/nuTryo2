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
        // Atribui aos atributos da classe os elementos de refeição
        this.listaTipoLabel = document.querySelector(".refeicao-tipo-tipoSelecionado") as Element;
        this.listaTipos = document.querySelector(".refeicao-tipo-list") as Element;
        this.listaTiposItem = document.querySelectorAll(".refeicao-tipo-list li") as NodeListOf<Element>;

        // Chama função para adicionar eventos de click
        this.adicionaEventosDeClick()
    }

    private adicionaEventosDeClick() {

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        //  # Abre a lista ao clicar no tipo selecionado
        
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

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # Adiciona eventos para seleção do tipo da refeição

        // Loop para adicionar eventos em todos elementos
        for (let i = 0; i <= this.listaTiposItem.length - 1; i++) {

            // Previne adição multipla de eventos de click
            if (!this.listaTiposItem[i].classList.contains("hasEvent")) {
                this.listaTiposItem[i].classList.add("hasEvent")

                // adiciona evento de click
                this.listaTiposItem[i].addEventListener("click", (e) => {
                    e.stopPropagation

                    // Armazena target em elemento clicado
                    var elementoClicado = e.currentTarget as HTMLElement

                    // Seleciona visualmente o tipo da refeição
                    this.refeicaoView.selecionaItem(elementoClicado)
                    // esconde os tipos da refeição
                    this.refeicaoView.toggleListaDeTipos()

                    // Ao clicar no tipo da refeição, retorna refeição do banco de dados
                    var refeicao = NutryoFetch.retornaRefeicao(
                        CalendarioController.dataSelecionada,
                        elementoClicado.parentElement?.parentElement?.getAttribute("value") as string
                    )

                    // Se houver retorno do banco, apenas troca o tipo da refeição da refeição existente
                    if (refeicao){
                        diaObjeto.editarTipoRefeicao(refeicao._id as string, elementoClicado.textContent)
                    }
                    // Se não houver retorno do banco, significa que refeição não existe, e precisa ser criada.
                    else{
                        // Gera um objeto de refeição local sem alimentos
                        diaObjeto.gerarRefeicao(
                           Number(elementoClicado.parentElement?.parentElement?.getAttribute("value") as string), 
                            elementoClicado.textContent,
                            []
                        )
                    }

                    // Pega o id da refeição sendo manipulada
                    var refeicaoAtual = document.querySelector(".abaSelecionada")?.getAttribute("value") as string
                    
                    // Troca visualmente o tipo da refeição sendo manipulada
                    this.refeicaoView.trocaTipo(refeicaoAtual, elementoClicado.textContent)
                })

            }
        }
    }

}

export default RefeicaoController