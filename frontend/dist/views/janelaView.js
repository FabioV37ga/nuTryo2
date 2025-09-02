class JanelaView {
    constructor() {
    }
    criaAba(titulo, id) {
        const elementoAba = `<a class="aba refeicao-aba" value="${id}">
                    <div class="refeicao-label">${titulo}</div>
                    <span class="refeicao-fechar">
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </span>
                </a>`;
        console.log("aqui!");
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
    }
    selecionaAba(aba) {
        console.log("aba!");
        const elementosAba = document.querySelectorAll(".aba");
        for (let i = 0; i < elementosAba.length; i++) {
            if (aba === i) {
                elementosAba[i].classList.add("abaSelecionada");
            }
            else {
                elementosAba[i].classList.remove("abaSelecionada");
            }
        }
    }
}
export default JanelaView;
