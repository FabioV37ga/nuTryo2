class JanelaView {
    criaAba(titulo, id) {
        const elementoAba = `<a class="aba abaSelecionavel refeicao-aba" value="${id}">
                    <div class="refeicao-label">${titulo}</div>
                    <span class="refeicao-fechar">
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </span>
                </a>`;
        const elementosAbaDOM = document.querySelectorAll(".refeicao-aba");
        if (elementosAbaDOM && elementosAbaDOM.length > 0) {
            for (let i = 0; i <= elementosAbaDOM.length - 1; i++) {
                if (Number(elementosAbaDOM[i].getAttribute("value")) == id) {
                    break;
                }
                if (i == elementosAbaDOM.length - 1) {
                    $(".janela-abas").append(elementoAba);
                }
            }
        }
        else {
            $(".janela-abas").append(elementoAba);
        }
        var elementoDOMCriado = document.querySelectorAll(".abaSelecionavel");
        this.estilizaAbasAdicionais();
        return elementoDOMCriado[elementoDOMCriado.length - 1];
    }
    selecionaAba(aba) {
        const abasSelecionaveis = document.querySelectorAll(".abaSelecionavel");
        for (let i = 0; i <= abasSelecionaveis.length - 1; i++) {
            abasSelecionaveis[i].classList.remove("abaSelecionada");
        }
        aba.classList.add("abaSelecionada");
        if (aba.classList.contains("abaRefeicoes"))
            this.mostrarConteudoAba("refeicoes");
        else
            this.mostrarConteudoAba("refeicao");
    }
    apagaAba(aba) {
        aba.remove();
        this.estilizaAbasAdicionais();
    }
    mostrarConteudoAba(tipo) {
        const conteudoRefeicoes = document.querySelector(".refeicoes-conteudo");
        const conteudoRefeicao = document.querySelector(".refeicao-conteudo");
        switch (tipo) {
            case "refeicoes":
                conteudoRefeicao.style.display = "none";
                conteudoRefeicoes.style.display = "flex";
                break;
            case "refeicao":
                conteudoRefeicoes.style.display = "none";
                conteudoRefeicao.style.display = "flex";
                break;
        }
    }
    estilizaAbasAdicionais() {
        var elementoDOMCriado = document.querySelectorAll(".abaSelecionavel");
        for (let i = 0; i <= elementoDOMCriado.length - 1; i++) {
            elementoDOMCriado[i].classList.remove("abaExtraFinal");
        }
        if (elementoDOMCriado.length >= 5) {
            elementoDOMCriado[elementoDOMCriado.length - 1].classList.add("abaExtraFinal");
        }
    }
}
export default JanelaView;
