class AlimentoView {
    static adicionarAlimento(data, id, nome, peso, calorias, proteinas, gorduras, carbos) {
        const elemento = `<div class="alimento-item" value="${id ? id : ""}">
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
                        peso="${peso}"
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
            `;
        $(".alimentos-adicionados").append(elemento);
    }
    static apagarAlimento(elemento) {
        var idApagado = parseInt(elemento.getAttribute("value"));
        var elementosRestantes = document.querySelectorAll(".alimento-item");
        if (elemento.classList.contains("editando")) {
            elemento.classList.remove("editando");
        }
        if (elementosRestantes) {
            for (let i = idApagado; i <= elementosRestantes.length - 1; i++) {
                elementosRestantes[i].setAttribute("value", String(parseInt(elementosRestantes[i].getAttribute("value")) - 1));
            }
        }
        elemento.remove();
    }
    toggleJanelaDeEdicao(botao) {
        var _a;
        var iconeClicavel = (_a = botao.parentElement) === null || _a === void 0 ? void 0 : _a.children[0].children[0];
        var alimento = botao.parentElement;
        if (!botao.classList.contains("janelaEdicao-aberta")) {
            iconeClicavel.classList.remove("fa-pencil");
            iconeClicavel.classList.add("fa-floppy-o");
            alimento.classList.remove("editado");
            alimento.classList.add("editando");
            botao.classList.add("janelaEdicao-aberta");
        }
        else {
            iconeClicavel.classList.remove("fa-floppy-o");
            iconeClicavel.classList.add("fa-pencil");
            alimento.classList.remove("editando");
            alimento.classList.add("editado");
            botao.classList.remove("janelaEdicao-aberta");
        }
    }
    mostraResultadosNaLista(dados, elemento) {
        var _a, _b;
        const lista = (_b = (_a = elemento.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.children[2];
        var resultadoItens = [];
        for (let i = 0; i <= 14; i++) {
            resultadoItens.push(lista.children[i]);
        }
        this.escondeResultadosNaLista(lista);
        lista.style.display = 'flex';
        for (let i = 0; i <= 14; i++) {
            var dado = dados[i];
            if (dado) {
                var id = dado.id;
                var calorias = dado.calorias;
                var proteinas = dado.proteinas;
                var textoFormatado = `${dados[i].nome}`;
                resultadoItens[i].style.display = 'initial';
                resultadoItens[i].textContent = textoFormatado;
                resultadoItens[i].setAttribute("value", id);
            }
            if (dados.length - 1 == i) {
                return;
            }
        }
    }
    selecionaItemAlimento(elemento) {
        var _a, _b;
        var texto = (_b = (_a = elemento.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.children[1].children[0];
        texto.value = elemento.textContent;
    }
    escondeResultadosNaLista(elemento) {
        const lista = elemento;
        var resultadoItens = [];
        for (let i = 0; i <= 14; i++) {
            resultadoItens.push(lista.children[i]);
        }
        lista.style.display = 'none';
        for (let i = 0; i <= 14; i++) {
            resultadoItens[i].style.display = 'none';
        }
    }
    preencheMacros(elemento, calorias, proteinas, gorduras, carboidratos) {
        var campoCalorias = elemento.children[0].children[1];
        var campoProteinas = elemento.children[1].children[1];
        var campoCarbo = elemento.children[2].children[1];
        var campoGorduras = elemento.children[3].children[1];
        campoCalorias.textContent = calorias;
        campoProteinas.textContent = proteinas;
        campoGorduras.textContent = gorduras;
        campoCarbo.textContent = carboidratos;
    }
    atualizarAlimento(elemento, dados) {
        var titulo = elemento;
        var stringTitulo = `<h1>${dados.nome ? dados.nome : "Novo alimento"}</h1>
                ${dados.peso ? dados.peso + " g • " : ""}  
                ${dados.calorias ? dados.calorias + "kcal • " : ""}
                ${dados.proteinas ? dados.proteinas + "g proteínas •" : ""}
                ${dados.carbos ? dados.carbos + "g carbos •" : ""}
                ${dados.gorduras ? dados.gorduras + "g gorduras" : ""}`;
        titulo.innerHTML = stringTitulo;
    }
}
export default AlimentoView;
