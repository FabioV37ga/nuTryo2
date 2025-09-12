import AlimentoController from "../controllers/alimentoController.js"

declare var $: any

class AlimentoView {

    static adicionarAlimento(
        data?: string,
        id?: string,
        nome?: string,
        peso?: string,
        calorias?: string,
        proteinas?: string,
        gorduras?: string,
        carbos?: string) {
        const elemento: string =
            `<div class="alimento-item" value="${id ? id : ""}">
                <a class="botao-editar-alimento">
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                </a>
                <span class="alimento-label">
                <h1>${nome ? nome : "Novo alimento"}</h1>
                ${peso ? peso + " g • " : ""}  
                ${calorias ? calorias + " kcal • " : ""}
                ${proteinas ? proteinas + " g proteínas •" : ""}
                ${carbos ? carbos + " g carbos •" : ""}
                ${gorduras ? gorduras + " g gorduras" : ""}
                </span>
                <div class="botao-apagar-alimento">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                </div>
                 <div class="alimento-item-janelaEdicao">
                    <div class="alimento-consumo">
                        <div class="alimento-selecao" 
                        calorias="${calorias}"
                        proteinas="${proteinas}"
                        gorduras="${gorduras}"
                        carbo="${carbos}"
                        >
                            <span class="selecao-label">
                                Alimento:
                            </span>
                            <span class="selecao-valor">
                                <input type="text" id="selecao-valor-texto" value="${nome ? nome : ""}" class="selecao-valor-texto" placeholder="Selecione alimento" autocomplete="off">
                            </span>
                            <ul class="alimento-selecao-lista">
                                <li class="alimento-selecao-lista-item" style="display:none"></li>
                                <li class="alimento-selecao-lista-item" style="display:none"></li>
                                <li class="alimento-selecao-lista-item" style="display:none"></li>
                                <li class="alimento-selecao-lista-item" style="display:none"></li>
                                <li class="alimento-selecao-lista-item" style="display:none"></li>
                                <li class="alimento-selecao-lista-item" style="display:none"></li>
                                <li class="alimento-selecao-lista-item" style="display:none"></li>
                                <li class="alimento-selecao-lista-item" style="display:none"></li>
                                <li class="alimento-selecao-lista-item" style="display:none"></li>
                                <li class="alimento-selecao-lista-item" style="display:none"></li>
                                <li class="alimento-selecao-lista-item" style="display:none"></li>
                                <li class="alimento-selecao-lista-item" style="display:none"></li>
                                <li class="alimento-selecao-lista-item" style="display:none"></li>
                                <li class="alimento-selecao-lista-item" style="display:none"></li>
                                <li class="alimento-selecao-lista-item" style="display:none"></li>
                            </ul>
                        </div>
                        <div class="alimento-pesoConsumido">
                            <div class="peso-label">
                                Peso:
                            </div>
                            <div class="peso-valor">
                                <input type="number" id="peso-valor-texto" class="peso-valor-texto" placeholder="Peso consumido" value="${peso ? peso : ""}">
                            </div>
                        </div>
                    </div>
                    <div class="alimento-macros">
                        <div class="calorias">
                            <div class="macros-label">
                                <span class="macros-label-valor">
                                    Calorias
                                </span>
                            </div>
                            <span class="macros-valor">
                                ${calorias ? calorias : "0.0"}
                            </span>
                        </div>
                        <div class="proteinas">
                            <div class="macros-label">
                                <span class="macros-label-valor">
                                    Proteínas
                                </span>
                            </div>
                            <span class="macros-valor">
                                ${proteinas ? proteinas : "0.0"}
                            </span>
                        </div>
                        <div class="carboidratos">
                            <div class="macros-label">
                                <span class="macros-label-valor">
                                    Carbos
                                </span>
                            </div>
                            <span class="macros-valor">
                                ${carbos ? carbos : "0.0"}
                            </span>
                        </div>
                        <div class="gorduras">
                            <div class="macros-label">
                                <span class="macros-label-valor">
                                    Gorduras
                                </span>
                            </div>
                            <span class="macros-valor">
                                ${gorduras ? gorduras : "0.0"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            `

        $(".alimentos-adicionados").append(elemento)
        // var alimentoController = new AlimentoController()
        // alimentoController.adicionarEventosDeClick()
    }

    static apagarAlimento(elemento: Element) {
        var idApagado: number = parseInt(elemento.getAttribute("value") as string)
        var elementosRestantes = document.querySelectorAll(".alimento-item")
        // console.log("apagando elemento:")
        // console.log(elemento)
        if (elemento.classList.contains("editando")) {
            elemento.classList.remove("editando")
        }
        if (elementosRestantes) {
            for (let i = idApagado; i <= elementosRestantes.length - 1; i++) {
                elementosRestantes[i].setAttribute("value", String(parseInt(elementosRestantes[i].getAttribute("value") as string) - 1))
            }
        }
        elemento.remove()

    }

    toggleJanelaDeEdicao(botao: Element) {
        // Marca referencias de elementos
        var iconeClicavel = botao.parentElement?.children[0].children[0] as Element
        var alimento = botao.parentElement as Element

        // Se a janela de edição estiver fechada, abre
        if (!botao.classList.contains("janelaEdicao-aberta")) {
            // Troca o icone de editar para salvar
            iconeClicavel.classList.remove("fa-pencil")
            iconeClicavel.classList.add("fa-floppy-o")

            // Abre espaço para arquivos abaixo
            alimento.classList.add("editando")

            // Abre janela de edição
            botao.classList.add("janelaEdicao-aberta")
        }

        // Se a janela de edição estiver aberta, fecha
        else {
            // Troca o icone de salvar para editar
            iconeClicavel.classList.remove("fa-floppy-o")
            iconeClicavel.classList.add("fa-pencil")

            // Fecha espaço para arquivos abaixo
            alimento.classList.remove("editando")

            // Fecha janela de edição
            botao.classList.remove("janelaEdicao-aberta")
        }
    }

    mostraResultadosNaLista(dados: object[] | any, elemento: Element) {

        // console.log("!!!!!!!!!!!!!!!!!!!!!!!")
        // console.log(elemento.parentElement?.parentElement?.children[2])
        const lista = elemento.parentElement?.parentElement?.children[2] as HTMLElement;
        var resultadoItens: Array<HTMLElement> = [];

        for (let i = 0; i <= 14; i++) {
            // console.log(lista.children[i])
            resultadoItens.push(lista.children[i] as HTMLElement)
        }


        this.escondeResultadosNaLista(lista)

        lista.style.display = 'flex'
        for (let i = 0; i <= 14; i++) {
            // Separa dados a serem impressos na lista
            var dado = dados[i]
            if (dado) {
                var id = dado.id
                var calorias = dado.calorias
                var proteinas = dado.proteinas

                // var textoFormatado = `${dados[i].nome} • ${formataDado(calorias)}kcal • ${formataDado(proteinas)}g Prots •`
                var textoFormatado = `${dados[i].nome}`

                resultadoItens[i].style.display = 'initial'
                resultadoItens[i].textContent = textoFormatado
                resultadoItens[i].setAttribute("value", id)
            }

            if (dados.length - 1 == i) {
                return
            }
        }

        function formataDado(dado: number) {
            return parseInt(dado.toFixed(0))
        }
    }

    selecionaItemAlimento(elemento: HTMLFormElement) {
        // console.log(elemento.textContent)
        // console.log(elemento.parentElement?.parentElement?.children[1].children[0])
        var texto = elemento.parentElement?.parentElement?.children[1].children[0] as HTMLFormElement
        texto.value = elemento.textContent
    }

    escondeResultadosNaLista(elemento: HTMLElement) {
        const lista = elemento
        var resultadoItens: Array<HTMLElement> = [];

        for (let i = 0; i <= 14; i++) {
            // console.log(lista.children[i])
            resultadoItens.push(lista.children[i] as HTMLElement)
        }

        // Reinicia estilização da lista
        lista.style.display = 'none'

        for (let i = 0; i <= 14; i++) {
            resultadoItens[i].style.display = 'none'
        }

    }

    preencheMacros(elemento: Element, calorias: string, proteinas: string, gorduras: string, carboidratos: string) {
        // console.log(elemento)
        // console.log(`Calorias: ${calorias}kcal, Proteinas: ${proteinas}g, Gorduras: ${gorduras}g, Carbos: ${carboidratos}g`)
        var campoCalorias = elemento.children[0].children[1]
        var campoProteinas = elemento.children[1].children[1]
        var campoCarbo = elemento.children[2].children[1]
        var campoGorduras = elemento.children[3].children[1]

        campoCalorias.textContent = calorias
        campoProteinas.textContent = proteinas
        campoGorduras.textContent = gorduras
        campoCarbo.textContent = carboidratos
    }

    atualizarAlimento(elemento: Element, dados: any) {
        var titulo = elemento as HTMLElement

        var stringTitulo = `<h1>${dados.nome ? dados.nome : "Novo alimento"}</h1>
                ${dados.peso ? dados.peso + " g • " : ""}  
                ${dados.calorias ? dados.calorias + "kcal • " : ""}
                ${dados.proteinas ? dados.proteinas + "g proteínas •" : ""}
                ${dados.carbos ? dados.carbos + "g carbos •" : ""}
                ${dados.gorduras ? dados.gorduras + "g gorduras" : ""}`

        titulo.innerHTML = stringTitulo;
    }
}

export default AlimentoView