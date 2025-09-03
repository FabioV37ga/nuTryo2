class RefeicaoView {
    toggleListaDeTipos() {
        const listaTipoLabel = document.querySelector(".refeicao-tipo-tipoSelecionado");
        const listaTipos = document.querySelector(".refeicao-tipo-list");
        console.log(listaTipos);
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
    }
}
export default RefeicaoView;
