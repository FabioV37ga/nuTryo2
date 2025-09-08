import AlimentoView from "../views/alimentoView.js"
import { backend } from "../utils/connection.js";
import CalendarioController from "./calendarioController.js";

class AlimentoController {
    static AlimentoControllerSearchInterval: any
    alimentoView = new AlimentoView()
    botaoAdicionarAlimento: Element
    botaoEditarAlimento: NodeListOf<Element>
    botaoApagarAlimento: NodeListOf<Element>


    constructor() {
        this.botaoAdicionarAlimento = document.querySelector(".botao-adicionar-alimento") as Element;
        this.botaoEditarAlimento = document.querySelectorAll(".botao-editar-alimento") as NodeListOf<Element>
        this.botaoApagarAlimento = document.querySelectorAll(".botao-apagar-alimento") as NodeListOf<Element>
        this.adicionarEventosDeClick();
    }

    criarElementosDeAlimento(alimento: any) {
        AlimentoView.adicionarAlimento(
            CalendarioController.dataSelecionada, 
            alimento._id, 
            alimento.alimento,
            alimento.peso,
            alimento.calorias,
            alimento.proteinas,
            alimento.gorduras,
            alimento.carboidratos
        )

        this.botaoEditarAlimento = document.querySelectorAll(".botao-editar-alimento") as NodeListOf<Element>
        this.botaoApagarAlimento = document.querySelectorAll(".botao-apagar-alimento") as NodeListOf<Element>
        setTimeout(() => {
            this.adicionarEventosDeClick()
        }, 100);
    }

    adicionarEventosDeClick() {


        // # Adiciona função para adicionar novos alimentos
        // Previne adição multipla de eventos de click
        if (!this.botaoAdicionarAlimento.classList.contains("hasEvent")) {
            this.botaoAdicionarAlimento.classList.add("hasEvent")

            // Adiciona evento de click
            this.botaoAdicionarAlimento.addEventListener("click", (e) => {
                e.stopPropagation

                // Adiciona alimento
                AlimentoView.adicionarAlimento(CalendarioController.dataSelecionada, "1")

                // Adiciona elementos criados nos atributos
                this.botaoEditarAlimento = document.querySelectorAll(".botao-editar-alimento")
                this.botaoApagarAlimento = document.querySelectorAll(".botao-apagar-alimento") as NodeListOf<Element>

                // Adiciona função de click aos elementos criados
                this.adicionarEventosDeClick()
            })
        }

        // # Adiciona função para editar e apagar alimentos
        for (let i = 0; i <= this.botaoEditarAlimento.length - 1; i++) {
            // Edição de alimentos
            // Previne adição multipla de eventos de click
            if (!this.botaoEditarAlimento[i].classList.contains("hasEvent")) {
                this.botaoEditarAlimento[i].classList.add("hasEvent")

                // Adiciona evento de click
                this.botaoEditarAlimento[i].addEventListener("click", (e) => {
                    e.stopPropagation

                    // Abre a janela de edição referente ao alimento clicado
                    var elementoClicado = e.currentTarget as Element
                    this.alimentoView.toggleJanelaDeEdicao(elementoClicado.parentElement?.children[3] as Element)
                })
            }

            // Remoção de alimentos
            // Previne adição multipla de eventos de click
            if (!this.botaoApagarAlimento[i].classList.contains("hasEvent")) {
                this.botaoApagarAlimento[i].classList.add("hasEvent")

                // Adiciona evento de click
                this.botaoApagarAlimento[i].addEventListener("click", (e) => {
                    e.stopPropagation

                    // Apaga alimento
                    var elementoClicado = e.currentTarget as Element
                    this.alimentoView.apagarAlimento(elementoClicado.parentElement as Element)
                })
            }

            var campoPesquisa = document.querySelectorAll(".selecao-valor-texto") as NodeListOf<HTMLElement>

            for (let i = 0; i <= campoPesquisa.length - 1; i++) {
                if (!campoPesquisa[i].classList.contains("hasSearchEvent")) {
                    campoPesquisa[i].classList.add("hasSearchEvent")

                    campoPesquisa[i].addEventListener("input", (e) => {
                        e.stopPropagation
                        var elemento = e.currentTarget as Element
                        this.pesquisaComDelay(elemento)
                    })
                }
            }

            // # Selecionar alimento pesquisado
            var resultadosPesquisa = document.querySelectorAll(".alimento-selecao-lista-item")
            for (let i = 0; i <= resultadosPesquisa.length - 1; i++) {
                if (!resultadosPesquisa[i].classList.contains("hasEvent")) {
                    resultadosPesquisa[i].classList.add("hasEvent")

                    resultadosPesquisa[i].addEventListener("click", (e) => {
                        var itemClicado = e.currentTarget as Element

                        this.selecionaItemPesquisado(itemClicado as Element)
                        this.alimentoView.selecionaItemAlimento(itemClicado as HTMLFormElement)
                        this.alimentoView.escondeResultadosNaLista(itemClicado.parentElement?.parentElement?.children[2] as HTMLElement)
                    })
                }
            }

            // # Fazer regra de 3 com o valor de consumo inserido

            var pesoConsumidoInput = document.querySelectorAll(".peso-valor-texto")

            for (let i = 0; i <= pesoConsumidoInput.length - 1; i++) {
                if (!pesoConsumidoInput[i].classList.contains("hasEvent")) {
                    pesoConsumidoInput[i].classList.add("hasEvent")

                    pesoConsumidoInput[i].addEventListener("input", (e) => {
                        var elementoManipulado = e.currentTarget as HTMLFormElement
                        var elementoPai = elementoManipulado.parentElement?.parentElement?.parentElement?.children[0] as Element

                        var calorias = elementoPai?.getAttribute("calorias")
                        var proteinas = elementoPai?.getAttribute("proteinas")
                        var gorduras = elementoPai?.getAttribute("gorduras")
                        var carbo = elementoPai?.getAttribute("carbo")

                        var pesoConsumido = elementoManipulado.value

                        var macrosCalulados = this.calcularMacros(pesoConsumido, calorias, proteinas, gorduras, carbo)

                        this.alimentoView.preencheMacros(
                            elementoPai.parentElement?.parentElement?.children[1] as Element,
                            macrosCalulados.calorias,
                            macrosCalulados.proteinas,
                            macrosCalulados.gorduras,
                            macrosCalulados.carbo
                        )
                    })
                }
            }

        }
    }

    private pesquisaComDelay(elemento: Element) {
        clearInterval(AlimentoController.AlimentoControllerSearchInterval)
        AlimentoController.AlimentoControllerSearchInterval = setInterval(() => {
            console.log("Toc")
            this.pesquisa(elemento)
            clearInterval(AlimentoController.AlimentoControllerSearchInterval)
        }, 300);

    }

    private async pesquisa(elemento: Element) {
        const campoPesquisa: HTMLFormElement = elemento.parentElement?.parentElement?.children[1].children[0] as HTMLFormElement
        const alimentoPesquisado = campoPesquisa.value
        if (alimentoPesquisado.replaceAll(" ", "") != "") {
            alimentoPesquisado.trim().replaceAll(" ", "%20")

            const resposta = await fetch(`${backend}/alimentos/buscar?nome=${alimentoPesquisado}`, {
                method: "GET",
                headers: {
                    "Content-Type": "Application/json"
                }
            })
            const dados = await resposta.json()
            if (dados) {
                console.log(dados)
                this.alimentoView.mostraResultadosNaLista(dados, elemento)
            }
        } else {
            this.alimentoView.escondeResultadosNaLista(elemento.parentElement?.parentElement?.children[2] as HTMLElement)
        }
    }

    private async selecionaItemPesquisado(elemento: Element) {
        console.log(backend + "/alimentos/" + elemento.getAttribute("value"))

        var calorias;
        var proteinas;
        var gorduras;
        var carbo;

        try {
            const alimentoSelecionadoFetch = await fetch(`${backend}/alimentos/${elemento.getAttribute("value")}`, {
                method: "GET",
                headers: {
                    "Content-Type": "Application/json"
                }
            })

            const alimentoSelecionado = await alimentoSelecionadoFetch.json()

            calorias = await alimentoSelecionado.calorias.toFixed(2)
            proteinas = await alimentoSelecionado.proteinas.toFixed(2)
            gorduras = await alimentoSelecionado.lipidios.toFixed(2)
            gorduras = await gorduras.toFixed(2)
            carbo = await alimentoSelecionado.carboidrato.toFixed(2)

            var labels = elemento.parentElement?.parentElement as HTMLElement
            labels?.setAttribute("calorias", await calorias)
            labels?.setAttribute("proteinas", await proteinas)
            labels?.setAttribute("gorduras", await gorduras)
            labels?.setAttribute("carbo", await carbo)


        } catch (error) {
            console.log(error)
        } finally {

            const campoPesoConsumido = elemento.parentElement?.parentElement?.parentElement?.children[1].children[1].children[0] as HTMLFormElement
            var pesoConsumido = campoPesoConsumido.value
            pesoConsumido = pesoConsumido == "" ? 0 : parseInt(pesoConsumido);

            var macrosCalulados = this.calcularMacros(pesoConsumido, calorias, proteinas, gorduras, carbo)

            this.alimentoView.preencheMacros(
                elemento.parentElement?.parentElement?.parentElement?.parentElement?.children[1] as Element,
                macrosCalulados.calorias,
                macrosCalulados.proteinas,
                macrosCalulados.gorduras,
                macrosCalulados.carbo
            )
        }


    }
    private calcularMacros(pesoConsumido: any, calorias: any, proteinas: any, gorduras: any, carbo: any) {
        var caloriasConsumidas: string = ((pesoConsumido * calorias) / 100).toFixed(2)
        var proteinasConsumidas: string = ((pesoConsumido * proteinas) / 100).toFixed(2)
        var gordurasConsumidas: string = ((pesoConsumido * gorduras) / 100).toFixed(2)
        var carboConsumidos: string = ((pesoConsumido * carbo) / 100).toFixed(2)

        return {
            calorias: caloriasConsumidas,
            proteinas: proteinasConsumidas,
            gorduras: gordurasConsumidas,
            carbo: carboConsumidos
        }
    }
}

export default AlimentoController