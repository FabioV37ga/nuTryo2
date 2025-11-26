class RefeicaoView {
    toggleListaDeTipos() {
        const listaTipos = document.querySelector(".refeicao-tipo-list");
        if (listaTipos.classList.contains("listaTipoFechada")) {
            listaTipos.classList.remove("listaTipoFechada");
            listaTipos.classList.add("listaTipoAberta");
        }
        else if (listaTipos.classList.contains("listaTipoAberta")) {
            listaTipos.classList.remove("listaTipoAberta");
            listaTipos.classList.add("listaTipoFechada");
        }
    }
    selecionaItem(item) {
        var label = document.querySelector(".refeicao-tipo-tipoSelecionado-label");
        label.textContent = item.textContent;
        this.mostraAlimentos();
    }
    mostraAlimentos() {
        var alimentos = document.querySelector(".alimentos");
        alimentos.style.display = "flex";
    }
    trocaTipo(refeicao, tipo) {
        var abas = document.querySelectorAll(".abaSelecionavel");
        for (let i = 1; i <= abas.length - 1; i++) {
            if (abas[i].getAttribute("value") == refeicao) {
                abas[i].children[0].textContent = tipo;
            }
        }
    }
}
export default RefeicaoView;
