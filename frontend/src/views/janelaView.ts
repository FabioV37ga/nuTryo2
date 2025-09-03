declare var $: any;
class JanelaView {

    criaAba(titulo: string, id: number) {
        const elementoAba: string =
            `<a class="aba abaSelecionavel refeicao-aba" value="${id}">
                    <div class="refeicao-label">${titulo}</div>
                    <span class="refeicao-fechar">
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </span>
                </a>`
        const elementosAbaDOM: NodeListOf<Element> = document.querySelectorAll(".refeicao-aba")
        if (elementosAbaDOM && elementosAbaDOM.length > 0) {
            for (let i = 0; i <= elementosAbaDOM.length - 1; i++) {
                if (Number(elementosAbaDOM[i].getAttribute("value")) == id) {
                    break;
                }
                if (i == elementosAbaDOM.length - 1) {
                    $(".janela-abas").append(elementoAba)
                }
            }
        } else {
            $(".janela-abas").append(elementoAba)
        }

        var elementoDOMCriado = document.querySelectorAll(".abaSelecionavel")
        return elementoDOMCriado[elementoDOMCriado.length - 1]
    }

    selecionaAba(aba: Element) {
        const abasSelecionaveis = document.querySelectorAll(".abaSelecionavel")
        for (let i = 0; i <= abasSelecionaveis.length - 1; i++) {
            abasSelecionaveis[i].classList.remove("abaSelecionada")
        }
        aba.classList.add("abaSelecionada")
    }

    apagaAba(aba: Element) {
            aba.remove()
    }
}

export default JanelaView