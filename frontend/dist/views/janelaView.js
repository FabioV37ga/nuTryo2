class JanelaView {
    constructor() {
    }
    selecionaAba(aba) {
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
