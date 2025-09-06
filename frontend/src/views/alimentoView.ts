declare var $: any

class AlimentoView {

    adicionarAlimento() {
        const elemento: string =
            `<div class="alimento-item">
                <a class="botao-editar-alimento">
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                </a>
                <span class="alimento-label">...
                </span>
                <div class="botao-apagar-alimento">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                </div>
                 <div class="alimento-item-janelaEdicao">
                    <div class="alimento-consumo">
                        <div class="alimento-selecao">
                            <span class="selecao-label">
                                Alimento:
                            </span>
                            <span class="selecao-valor">
                                <input type="text" id="selecao-valor-texto" class="selecao-valor-texto" placeholder="Selecione alimento">
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
                            </ul>
                        </div>
                        <div class="alimento-pesoConsumido">
                            <div class="peso-label">
                                Peso:
                            </div>
                            <div class="peso-valor">
                                <input type="text" id="peso-valor-texto" class="peso-valor-texto" placeholder="Peso consumido">
                            </div>
                        </div>
                    </div>
                    <div class="alimento-macros">
                        <div class="calorias">
                            <div class="macros-label">
                                <span class="macros-label-valor">
                                    Calorias:
                                </span>
                            </div>
                            <span class="macros-valor">
                                ...
                            </span>
                        </div>
                        <div class="proteinas">
                            <div class="macros-label">
                                <span class="macros-label-valor">
                                    Proteínas:
                                </span>
                            </div>
                            <span class="macros-valor">
                                ...
                            </span>
                        </div>
                        <div class="carboidratos">
                            <div class="macros-label">
                                <span class="macros-label-valor">
                                    Carbos:
                                </span>
                            </div>
                            <span class="macros-valor">
                                ...
                            </span>
                        </div>
                        <div class="gorduras">
                            <div class="macros-label">
                                <span class="macros-label-valor">
                                    Gorduras:
                                </span>
                            </div>
                            <span class="macros-valor">
                                ...
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            `


        $(".alimentos-adicionados").append(elemento)
    }

    apagarAlimento(elemento: Element) {
        if (elemento.parentElement?.classList.contains("editando")) {
            elemento.parentElement?.classList.remove("editando")
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
            iconeClicavel.classList.add("fa-bookmark")

            // Abre espaço para arquivos abaixo
            alimento.classList.add("editando")

            // Abre janela de edição
            botao.classList.add("janelaEdicao-aberta")
        } 

        // Se a janela de edição estiver aberta, fecha
        else {
            // Troca o icone de salvar para editar
            iconeClicavel.classList.remove("fa-bookmark")
            iconeClicavel.classList.add("fa-pencil")
            
            // Fecha espaço para arquivos abaixo
            alimento.classList.remove("editando")

            // Fecha janela de edição
            botao.classList.remove("janelaEdicao-aberta")
        }
    }
}

export default AlimentoView