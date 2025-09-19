import AlimentoView from "../views/alimentoView.js"
import { backend } from "../utils/connection.js";
import CalendarioController from "./calendarioController.js";
import JanelaController from "./janelaController.js";
import NutryoFetch from "../utils/nutryoFetch.js";
import diaObjeto from "../utils/diaObjeto.js";

class AlimentoController extends JanelaController {
    static AlimentoControllerSearchInterval: any
    static AlimentoControllerTypeWeightInterval: any;
    alimentoView = new AlimentoView()
    botaoAdicionarAlimento: Element
    botaoEditarAlimento: NodeListOf<Element>
    botaoApagarAlimento: NodeListOf<Element>


    constructor() {
        super()
        // Define botão de adicionar novo alimento
        this.botaoAdicionarAlimento = document.querySelector(".model-alimento") as Element;
        // Define botões de aditar alimentos já existentes
        this.botaoEditarAlimento = document.querySelectorAll(".botao-editar-alimento") as NodeListOf<Element>
        // Define botões de remover alimentos já existentes
        this.botaoApagarAlimento = document.querySelectorAll(".botao-apagar-alimento") as NodeListOf<Element>
        // Chama função para adicionar eventos no click dos botões
        this.adicionarEventosDeClick();
    }

    adicionarEventosDeClick() {

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # Adiciona função para adicionar novos alimentos
        // Previne adição multipla de eventos de click
        if (!this.botaoAdicionarAlimento.classList.contains("hasEvent")) {
            this.botaoAdicionarAlimento.classList.add("hasEvent")

            // Adiciona evento de click
            this.botaoAdicionarAlimento.addEventListener("click", (e) => {
                e.stopPropagation

                // Armazena elementos referentes aos alimentos em "alimentos"
                var alimentos = document.querySelectorAll(".alimento-item")

                // Inicializa ID do alimento como 1
                var proximoID = 1;

                // Caso haja mais alimentos adicionados, incrementa ID em 1 para cada alimento
                if (alimentos.length > 1) {
                    proximoID = parseInt(alimentos[alimentos.length - 1].getAttribute("value") as string) + 1
                }

                // Adiciona alimento
                AlimentoView.adicionarAlimento(CalendarioController.dataSelecionada, String(proximoID))

                // Redefine atributos com os novo alimentos criados
                this.botaoEditarAlimento = document.querySelectorAll(".botao-editar-alimento")
                this.botaoApagarAlimento = document.querySelectorAll(".botao-apagar-alimento") as NodeListOf<Element>

                // Adiciona função de click aos elementos criados
                this.adicionarEventosDeClick()
            })
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # Adiciona função para editar e apagar alimentos
        // Loop para adicionar em todos os elementos 
        for (let i = 0; i <= this.botaoEditarAlimento.length - 1; i++) {

            // ----------------------------------------------------
            // ## Edição de alimentos
            // Previne adição multipla de eventos de click
            if (!this.botaoEditarAlimento[i].classList.contains("hasEvent")) {
                this.botaoEditarAlimento[i].classList.add("hasEvent")

                // Adiciona evento de click
                this.botaoEditarAlimento[i].addEventListener("click", (e) => {
                    e.stopPropagation

                    // Armazena o target do click, no caso, o botão de editar clicado nessa variavel:
                    var elementoClicado = e.currentTarget as Element

                    // Abre a janela de edição referente ao alimento clicado
                    this.alimentoView.toggleJanelaDeEdicao(elementoClicado.parentElement?.children[3] as Element)
                })
            }

            // ----------------------------------------------------
            // ## Remoção de alimentos
            // Previne adição multipla de eventos de click
            if (!this.botaoApagarAlimento[i].classList.contains("hasEvent")) {
                this.botaoApagarAlimento[i].classList.add("hasEvent")

                // Adiciona evento de click
                this.botaoApagarAlimento[i].addEventListener("click", (e) => {
                    e.stopPropagation

                    // Armazena o target do clock, no caso, o botão de apagar nessa variavel:
                    var elementoClicado = e.currentTarget as Element
                    elementoClicado = elementoClicado.parentElement as Element

                    // Essa parte é resposável por pegar o ID da refeição, que é um value do elemento "refeicao-tipo" para apagar o alimento na refeição correta
                    var refeicao = document.querySelector(".refeicao-tipo") as HTMLElement

                    // Chama função para apagar o alimento no objeto 
                    diaObjeto.apagarAlimento(
                        refeicao.getAttribute("value") as string,
                        elementoClicado.getAttribute("value") as string
                    )

                    // Chama função para apagar o alimento na página
                    AlimentoView.apagarAlimento(elementoClicado as Element)
                })
            }

        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # Digitar o nome do alimento faz uma pesquisa no banco e mostra os resultados
        // Armazena campos de pesquisa de alimento nessa variavel
        var campoPesquisa = document.querySelectorAll(".selecao-valor-texto") as NodeListOf<HTMLElement>

        // Loop para adicionar em todos os elementos de campo de pesquisa (um de cada alimento existente na página)
        for (let i = 0; i <= campoPesquisa.length - 1; i++) {

            // Previne adição multipla de eventos de input
            if (!campoPesquisa[i].classList.contains("hasSearchEvent")) {
                campoPesquisa[i].classList.add("hasSearchEvent")

                // Adiciona evento de input (sempre que um usuario digita alguma coisa no campo)
                campoPesquisa[i].addEventListener("input", (e) => {
                    e.stopPropagation

                    // armazena target
                    var elemento = e.currentTarget as Element

                    // Faz uma pesquisa com delay em cima do target (valor inserido)
                    this.pesquisaComDelay(elemento)
                })
            }
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # Selecionar alimento pesquisado
        // Armazena elementos de resultado da pesquisa feita por um alimento
        var resultadosPesquisa = document.querySelectorAll(".alimento-selecao-lista-item")

        // Loop para adicionar em todos os elementos de resultado de pesquisa
        for (let i = 0; i <= resultadosPesquisa.length - 1; i++) {

            // Previne adição multipla de eventos de click
            if (!resultadosPesquisa[i].classList.contains("hasEvent")) {
                resultadosPesquisa[i].classList.add("hasEvent")

                // Adiciona eventos de click
                resultadosPesquisa[i].addEventListener("click", (e) => {

                    // Armazena item clicado
                    var itemClicado = e.currentTarget as Element

                    // Chama função para selecionar logicamente o alimento clicado
                    this.selecionaItemPesquisado(itemClicado as HTMLElement)

                    // Chama função para selecionar visualmente o alimento clicado
                    this.alimentoView.selecionaItemAlimento(itemClicado as HTMLFormElement)

                    //  Chama função para esconder visualmente a lista
                    this.alimentoView.escondeResultadosNaLista(itemClicado.parentElement?.parentElement?.children[2] as HTMLElement)

                    // Retorna valores inseridos e calculados do alimento
                    var valores = this.retornaValoresInseridos(itemClicado.parentElement?.parentElement?.parentElement?.parentElement) as any

                    // Chama função para atualizar visualmente o alimento depois de selecionar um alimento
                    this.alimentoView.atualizarAlimento(
                        itemClicado.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[1] as HTMLElement,
                        valores)

                    //  Chama função para enviar para o banco de dados
                    this.enviaAlimento(
                        itemClicado.parentElement?.parentElement?.parentElement?.parentElement?.parentElement as HTMLElement,
                        valores
                    )
                })
            }
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # (Mobile) Garante o funcionamento do scroll - Quando o usuário está digitando no campo de pesquisa, desabilita o scroll dos outros alimentos
        // var janelaPesquisa = document.querySelectorAll(".alimento-selecao-lista") as NodeListOf<HTMLElement>

        // for (let i = 0; i <= janelaPesquisa.length - 1; i++) {
        //     if (!janelaPesquisa[i].classList.contains("hasFocusEvent")) {
        //         janelaPesquisa[i].classList.add("hasFocusEvent")

        //         janelaPesquisa[i].addEventListener("focus", () => {
        //             if (window.innerWidth <= 1000) {

        //                 janelaPesquisa[i].scrollIntoView({
        //                     behavior: "smooth",
        //                     block: "center"
        //                 })

        //                 document.body.style.overflow = 'hidden'
        //                 document.body.style.position = 'fixed'
        //             }
        //         })
        //     }

        //     if (!janelaPesquisa[i].classList.contains("hasBlurEvent")) {
        //         janelaPesquisa[i].classList.add("hasBlurEvent")

        //         janelaPesquisa[i].addEventListener("blur", () => {
        //             if (window.innerWidth <= 1000) {

        //                 document.body.style.overflow = "initial"
        //                 document.body.style.position = 'initial'
        //             }
        //         })
        //     }
        // }


        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # Preencher o campo "Peso" faz regra de 3 com o valor de consumo inserido

        // Armazena elementos de "peso consumido" (input do usuário)
        var pesoConsumidoInput = document.querySelectorAll(".peso-valor-texto")

        // Loop para adicionar evento em todos
        for (let i = 0; i <= pesoConsumidoInput.length - 1; i++) {

            // Previne adição múltipla de eventos de input
            if (!pesoConsumidoInput[i].classList.contains("hasEvent")) {
                pesoConsumidoInput[i].classList.add("hasEvent")

                // Adiciona eventos de input
                pesoConsumidoInput[i].addEventListener("input", (e) => {

                    // Armazena target editado (no caso, o campo de "peso consumido")
                    var elementoManipulado = e.currentTarget as HTMLFormElement

                    // Armazena o elemento pai do target (No caso, o elemento pai onde estão todos os valores)
                    var elementoPai = elementoManipulado.parentElement?.parentElement?.parentElement?.children[0] as Element

                    // Armazena valores do alimento nas variaveis
                    var peso = elementoPai?.getAttribute("peso")
                    var calorias = elementoPai?.getAttribute("calorias")
                    var proteinas = elementoPai?.getAttribute("proteinas")
                    var gorduras = elementoPai?.getAttribute("gorduras")
                    var carbo = elementoPai?.getAttribute("carbo")
                    var pesoConsumido = elementoManipulado.value

                    // Chama função para fazer regra de 3 com os valores inseridos e armazena dados em "macrosCalculados"
                    var macrosCalulados = this.calcularMacros(pesoConsumido, Number(peso), calorias, proteinas, gorduras, carbo)

                    // Chama função para alterar visualmente os dados do alimento 
                    this.alimentoView.preencheMacros(
                        elementoPai.parentElement?.parentElement?.children[1] as Element,
                        macrosCalulados.calorias,
                        macrosCalulados.proteinas,
                        macrosCalulados.gorduras,
                        macrosCalulados.carbo
                    )

                    // Armazena elemento manipulado (Referente a instância de elemento, visualmente dizendo)
                    var alimento: HTMLElement = e.currentTarget as HTMLElement
                    alimento = alimento.parentElement?.parentElement?.parentElement?.parentElement?.parentElement as HTMLElement

                    // Pega os novos valores do alimento (Depois do calculo de regra de 3)
                    var valores = this.retornaValoresInseridos(alimento.children[3]) as any


                    // Sessão com intervalo: Só executa depois que o usuário para de digitar por 300ms - evita multiplas requisições consecutivas

                    // Começa limpando o intervalo, se já existe
                    clearInterval(AlimentoController.AlimentoControllerTypeWeightInterval)

                    // Define o intervalo
                    AlimentoController.AlimentoControllerTypeWeightInterval = setInterval(() => {
                        // Envia logicamente o alimento
                        this.enviaAlimento(alimento, valores)
                        // Limpa o intervalo
                        clearInterval(AlimentoController.AlimentoControllerTypeWeightInterval)
                    }, 300);

                    // Por fim, atualiza visualmente o alimento
                    this.alimentoView.atualizarAlimento(alimento.children[1], valores)
                })
            }
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # Clicar na aba de algum elemento cria elementos de alimento referente a aba
        // armazena abas de alimentos existêntes
        var abasDeAlimento = document.querySelectorAll(".refeicao-aba") as NodeListOf<HTMLElement>

        // Loop para adicionar eventos em todas
        for (let i = 0; i <= abasDeAlimento.length - 1; i++) {

            // previne adição multipla de eventos de click  
            if (!abasDeAlimento[i].classList.contains("hasCreateEvent")) {
                abasDeAlimento[i].classList.add("hasCreateEvent")

                // Adiciona evento de click
                abasDeAlimento[i].addEventListener("click", () => {
                    // chama função para retornar os alimentos da refeição clicada
                    var alimentos = NutryoFetch.retornaAlimentosDaRefeicao(CalendarioController.dataSelecionada, abasDeAlimento[i].getAttribute("value") as string)
                })
            }
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por criar instância de alimento
    criarElementosDeAlimento(alimento: any) {

        // Chama método para criar visualmente um alimento
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

        // Reatribui elementos dos botões dos alimentos criados agora
        this.botaoEditarAlimento = document.querySelectorAll(".botao-editar-alimento") as NodeListOf<Element>
        this.botaoApagarAlimento = document.querySelectorAll(".botao-apagar-alimento") as NodeListOf<Element>

        // Com um delay de 100ms, adiciona funções de click ao alimento criado
        setTimeout(() => {
            this.adicionarEventosDeClick()
        }, 100);
    }


    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por pesquisar um alimento com delay - para evitar multiplas requisições consecutivas
    private pesquisaComDelay(elemento: Element) {

        // Começa limpando o intervalo de delay de pesquisa
        clearInterval(AlimentoController.AlimentoControllerSearchInterval)

        // Cria um intervalo de delay de pesquisa
        AlimentoController.AlimentoControllerSearchInterval = setInterval(() => {
            // Chama função para efetuar pesquisa do alimento
            this.pesquisa(elemento)
            // Limpa intervalo de delay
            clearInterval(AlimentoController.AlimentoControllerSearchInterval)
        }, 300);

    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por pesquisar alimentos de acordo com o nome inserido no campo de pesquisa de um alimento especifico
    private async pesquisa(elemento: Element) {

        // Armazena em "campoPesquisa" o elemento passado como parâmetro
        const campoPesquisa: HTMLFormElement = elemento.parentElement?.parentElement?.children[1].children[0] as HTMLFormElement

        // Armazena em alimentoPesquisado o texto dentro do elemento passado como parâmetro
        const alimentoPesquisado = campoPesquisa.value

        // Se houver valor a ser pesquisado...
        if (alimentoPesquisado.replaceAll(" ", "") != "") {
            alimentoPesquisado.trim().replaceAll(" ", "%20")

            // Pesquisa alimentos relacionados ao valor pesquisado no backend
            const resposta = await fetch(`${backend}/alimentos/buscar?nome=${alimentoPesquisado}`, {
                method: "GET",
                headers: {
                    "Content-Type": "Application/json"
                }
            })
            // Armazena em "dados" a resposta da pesquisa do backend
            const dados = await resposta.json()

            // Se houverem dados, mostra visualmente eles na página
            if (dados) {
                this.alimentoView.mostraResultadosNaLista(dados, elemento)
            }
        }
        // Se não houver valor a ser pesquisado, apenas esconde a lista de pesquisa
        else {
            this.alimentoView.escondeResultadosNaLista(elemento.parentElement?.parentElement?.children[2] as HTMLElement)
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por selecionar um item da lista de alimentos anteriormente pesquisada
    private async selecionaItemPesquisado(elemento: HTMLElement) {

        // Inicializa variaveis de valores do alimento
        var peso;
        var calorias;
        var proteinas;
        var gorduras;
        var carbo;

        // Ao selecionar um alimento da lista, busca as informações no backend, na tabela de alimentos
        try {
            const alimentoSelecionadoFetch = await fetch(`${backend}/alimentos/${elemento.getAttribute("value")}`, {
                method: "GET",
                headers: {
                    "Content-Type": "Application/json"
                }
            })

            // Armazena objeto do alimento
            const alimentoSelecionado = await alimentoSelecionadoFetch.json()

            // Atribui os valores do alimento nas variavel anteriormente inicializadas
            peso = await parseFloat(alimentoSelecionado.peso).toFixed(2)
            calorias = await parseFloat(alimentoSelecionado.calorias).toFixed(2)
            proteinas = await parseFloat(alimentoSelecionado.proteinas).toFixed(2)
            gorduras = await parseFloat(alimentoSelecionado.lipidios).toFixed(2)
            carbo = await parseFloat(alimentoSelecionado.carboidrato).toFixed(2)

            // Pendura no elemento HTML do alimento os valores, isso auxilia outros métodos a acessarem os valores nutricionais desse alimento
            var labels = elemento.parentElement?.parentElement as HTMLElement
            labels?.setAttribute("peso", await String(peso))
            labels?.setAttribute("calorias", await String(calorias))
            labels?.setAttribute("proteinas", await String(proteinas))
            labels?.setAttribute("gorduras", await String(gorduras))
            labels?.setAttribute("carbo", await String(carbo))

        } catch (error) {
            console.log(error)
        } finally {
            // Ao fim da requisição, chama função para fazer regra de 3 a partir dos valores da tabela de alimentos X valores inseridos pelo usuário

            // Armazena campo de "Peso consumido" do alimento especifico
            const campoPesoConsumido = elemento.parentElement?.parentElement?.parentElement?.children[1].children[1].children[0] as HTMLFormElement

            // Armazena valor textual do elemento de peso consumido 
            var pesoConsumido = campoPesoConsumido.value
            // Faz tratamento do valor de peso consumido
            pesoConsumido = pesoConsumido == "" ? 0 : parseInt(pesoConsumido);

            // Chama função para calular os macros (regra de 3) e atribui retorno a "macrosCalculados"
            var macrosCalulados = this.calcularMacros(pesoConsumido, 100, calorias, proteinas, gorduras, carbo)

            // Chama função para preencher os dados calculados nos elementos do alimento específico
            this.alimentoView.preencheMacros(
                elemento.parentElement?.parentElement?.parentElement?.parentElement?.children[1] as Element,
                macrosCalulados.calorias,
                macrosCalulados.proteinas,
                macrosCalulados.gorduras,
                macrosCalulados.carbo
            )
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por fazer a regra de 3 a partir dos dados de um alimento em relação ao peso consumido pelo usuário
    private calcularMacros(pesoConsumido: any, pesoReferencia: number, calorias: any, proteinas: any, gorduras: any, carbo: any) {

        // A referência é o peso consumido pelo usuário, se o usuário ainda não inseriu um peso, faz com 100g, que é o valor base da tabela de alimentos
        var referencia = pesoReferencia ? pesoReferencia : 100

        //  Faz calculos de regra de 3
        var caloriasConsumidas: string = ((pesoConsumido * calorias) / referencia).toFixed(2)
        var proteinasConsumidas: string = ((pesoConsumido * proteinas) / referencia).toFixed(2)
        var gordurasConsumidas: string = ((pesoConsumido * gorduras) / referencia).toFixed(2)
        var carboConsumidos: string = ((pesoConsumido * carbo) / referencia).toFixed(2)

        // Retorna valores calculados
        return {
            calorias: caloriasConsumidas,
            proteinas: proteinasConsumidas,
            gorduras: gordurasConsumidas,
            carbo: carboConsumidos
        }
    }


    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por retornar valores calculados e inseridos de um alimento específico
    private retornaValoresInseridos(alimento: any) {

        // A janela é o elemento chamado como atributo
        var janela = alimento

        // Atribui segmentos (consumo e macros)
        var consumo = janela.children[0]
        var macros = janela.children[1]

        // Atribui valores de consumo (O nome do alimento, e o peso do alimento)
        var nome = consumo.children[0].children[1].children[0].value
        var peso = consumo.children[1].children[1].children[0].value

        // Atribui valores de macros (Valor nutricional do alimento)
        var calorias = macros.children[0].children[1].textContent
        var proteinas = macros.children[1].children[1].textContent
        var carboidratos = macros.children[2].children[1].textContent
        var gorduras = macros.children[3].children[1].textContent

        // Se todos os campos estiverem preenchidos, faz retorno dos dados
        if (nome && peso && calorias && proteinas && carboidratos && gorduras) {
            return {
                nome: nome,
                peso: peso,
                calorias: calorias,
                proteinas: proteinas,
                carboidratos: carboidratos,
                gorduras: gorduras
            }
        }
        // Se houver algum campo vazio, retorna false
        else {
            return false
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    //  # Método responsável por enviar alimentos para o tratamento de objetos local (Um passo antes de enviar para o banco)
    private enviaAlimento(elemento: HTMLElement, valores: any) {

        console.log("#AlimentoController - Mudanças no alimento detectadas, fazendo envio das atualizações")

        // Se houverem valores, incia lógica
        if (valores) {

            // Atualiza os alimentos do usuário conectado (no caso de alguma alteração ter sido feita na sessão atual)
            var busca = new NutryoFetch(diaObjeto.usuario)
            // Define status como 0, só vira 1 quando a requisição termina.
            NutryoFetch.status = 0

            // Esse intervalo é responsável por só executar quando a busca terminar
            var intervaloBusca = setInterval(() => {
                // Se o status for 1 (requisição completa)
                if (NutryoFetch.status == 1) {

                    // Armazena em "RefeicaoAtual" o id da refeição que está sendo manipulada
                    var refeicaoAtual: any = document.querySelector(".refeicao-tipo")?.getAttribute("value") as string

                    // Gera um objeto de alimento (local)
                    diaObjeto.gerarAlimento(
                        refeicaoAtual,
                        String(Number(elemento.getAttribute("value"))) as string,
                        valores.nome,
                        valores.peso,
                        valores.calorias,
                        valores.proteinas,
                        valores.carboidratos,
                        valores.gorduras
                    )

                    // Limpa o intervalo
                    clearInterval(intervaloBusca)
                }
            }, 1);
        }
    }
}

export default AlimentoController