import AlimentoView from "../views/alimentoView.js"
import { backend } from "../utils/connection.js";
import CalendarioController from "./calendarioController.js";
import JanelaController from "./janelaController.js";
import NutryoFetch from "../utils/nutryoFetch.js";
import diaObjeto from "../utils/diaObjeto.js";

class AlimentoController extends JanelaController {
    static AlimentoControllerSearchInterval: any
    alimentoView = new AlimentoView()
    botaoAdicionarAlimento: Element
    botaoEditarAlimento: NodeListOf<Element>
    botaoApagarAlimento: NodeListOf<Element>


    constructor() {
        super()
        this.botaoAdicionarAlimento = document.querySelector(".botao-adicionar-alimento") as Element;
        this.botaoEditarAlimento = document.querySelectorAll(".botao-editar-alimento") as NodeListOf<Element>
        this.botaoApagarAlimento = document.querySelectorAll(".botao-apagar-alimento") as NodeListOf<Element>
        this.adicionarEventosDeClick();
    }

    adicionarEventosDeClick() {


        // # Adiciona função para adicionar novos alimentos
        // Previne adição multipla de eventos de click
        if (!this.botaoAdicionarAlimento.classList.contains("hasEvent")) {
            this.botaoAdicionarAlimento.classList.add("hasEvent")

            // Adiciona evento de click
            this.botaoAdicionarAlimento.addEventListener("click", (e) => {
                e.stopPropagation

                // Id
                var alimentos = document.querySelectorAll(".alimento-item")
                var proximoID = 1;
                if (alimentos.length > 1) {
                    proximoID = parseInt(alimentos[alimentos.length - 1].getAttribute("value") as string) + 1
                    // console.log(proximoID)
                }

                // Adiciona alimento
                AlimentoView.adicionarAlimento(CalendarioController.dataSelecionada, String(proximoID))

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

                    // Salva edições no alimento, se campos preenchidos.
                    if (elementoClicado.children[0].classList.contains("fa-floppy-o")) {
                        // console.log("clicar agora deveria salvar")
                        // console.log(elementoClicado.parentElement?.getAttribute("value"))
                        var valores = this.retornaValoresInseridos(elementoClicado as HTMLFormElement) as any
                        if (valores != false) {
                            var busca = new NutryoFetch(diaObjeto.usuario)

                            var intervalo = setInterval(() => {
                                if (NutryoFetch.status == 1) {
                                    var refeicaoAtual: any = document.querySelector(".refeicao-tipo")?.getAttribute("value") as string

                                    diaObjeto.gerarAlimento(
                                        refeicaoAtual,
                                        elementoClicado.parentElement?.getAttribute("value") as string,
                                        valores.nome,
                                        valores.peso,
                                        valores.calorias,
                                        valores.proteinas,
                                        valores.carboidratos,
                                        valores.gorduras
                                    )

                                    this.alimentoView.atualizarAlimento(elementoClicado.parentElement as Element, valores)

                                    clearInterval(intervalo)
                                }
                            }, 1);
                        }
                    }
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
                    elementoClicado = elementoClicado.parentElement as Element

                    var refeicao = document.querySelector(".refeicao-tipo") as HTMLElement
                    diaObjeto.apagarAlimento(
                        refeicao.getAttribute("value") as string,
                        elementoClicado.getAttribute("value") as string)

                    AlimentoView.apagarAlimento(elementoClicado as Element)
                })
            }

        }
        // # Digitar o nome do alimento faz uma pesquisa no banco e mostra os resultados
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

        // # Preencher o campo "Peso" faz regra de 3 com o valor de consumo inserido

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

        // # Clicar na aba "REFEIÇÕES" apaga os alimentos das outras abas
        // var abaRefeicoes = document.querySelectorAll(".aba")[1]

        // if (!abaRefeicoes.classList.contains("hasDeleteEvent")) {
        //     abaRefeicoes.classList.add("hasDeleteEvent")

        //     abaRefeicoes.addEventListener("click", () => {
        //         var itensDeAlimento = document.querySelectorAll(".alimento-item")

        //         for (let i = 1; i <= itensDeAlimento.length - 1; i++) {
        //             this.alimentoView.apagarAlimento(itensDeAlimento[i])
        //         }
        //     })
        // }

        // # Clicar na aba de algum elemento cria elementos de alimento referente a aba
        var abasDeAlimento = document.querySelectorAll(".refeicao-aba") as NodeListOf<HTMLElement>

        for (let i = 0; i <= abasDeAlimento.length - 1; i++) {
            if (!abasDeAlimento[i].classList.contains("hasCreateEvent")) {
                abasDeAlimento[i].classList.add("hasCreateEvent")
                abasDeAlimento[i].addEventListener("click", () => {

                    var alimentos = NutryoFetch.retornaAlimentosDaRefeicao(CalendarioController.dataSelecionada, abasDeAlimento[i].getAttribute("value") as string)
                    // for (let alimento = 0; alimento <= alimentos.length - 1; alimento++) {
                    //     this.criarElementosDeAlimento(alimentos[alimento])
                    // }
                })

            }
        }

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


    private pesquisaComDelay(elemento: Element) {
        clearInterval(AlimentoController.AlimentoControllerSearchInterval)
        AlimentoController.AlimentoControllerSearchInterval = setInterval(() => {
            // console.log("Toc")
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
                // console.log(dados)
                this.alimentoView.mostraResultadosNaLista(dados, elemento)
            }
        } else {
            this.alimentoView.escondeResultadosNaLista(elemento.parentElement?.parentElement?.children[2] as HTMLElement)
        }
    }

    private async selecionaItemPesquisado(elemento: Element) {
        // console.log(backend + "/alimentos/" + elemento.getAttribute("value"))

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

            // console.log(typeof (alimentoSelecionado.calorias))

            calorias = await parseFloat(alimentoSelecionado.calorias).toFixed(2)
            proteinas = await parseFloat(alimentoSelecionado.proteinas).toFixed(2)
            gorduras = await parseFloat(alimentoSelecionado.lipidios).toFixed(2)
            carbo = await parseFloat(alimentoSelecionado.carboidrato).toFixed(2)



            var labels = elemento.parentElement?.parentElement as HTMLElement
            labels?.setAttribute("calorias", await String(calorias))
            labels?.setAttribute("proteinas", await String(proteinas))
            labels?.setAttribute("gorduras", await String(gorduras))
            labels?.setAttribute("carbo", await String(carbo))


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

    private retornaValoresInseridos(alimento: any) {
        // console.log(alimento)

        var janela = alimento.parentElement?.children[3]
        var consumo = janela.children[0]
        var macros = janela.children[1]

        var nome = consumo.children[0].children[1].children[0].value
        var peso = consumo.children[1].children[1].children[0].value

        var calorias = macros.children[0].children[1].textContent
        var proteinas = macros.children[1].children[1].textContent
        var carboidratos = macros.children[2].children[1].textContent
        var gorduras = macros.children[3].children[1].textContent

        if (nome && peso && calorias && proteinas && carboidratos && gorduras) {
            return {
                nome: nome,
                peso: peso,
                calorias: calorias,
                proteinas: proteinas,
                carboidratos: carboidratos,
                gorduras: gorduras
            }
        } else {
            return false
        }

    }
}

export default AlimentoController