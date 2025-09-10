declare var $: any;

class RefeicaoView {
    toggleListaDeTipos() {
        const listaTipoLabel: Element = document.querySelector(".refeicao-tipo-tipoSelecionado") as Element;
        const listaTipos: Element = document.querySelector(".refeicao-tipo-list") as Element;

        // console.log(listaTipos)
        if (listaTipos.classList.contains("listaTipoFechada")) {
            listaTipos.classList.remove("listaTipoFechada")
            listaTipos.classList.add("listaTipoAberta")
        }
        else if (listaTipos.classList.contains("listaTipoAberta")) {
            listaTipos.classList.remove("listaTipoAberta")
            listaTipos.classList.add("listaTipoFechada")
        }
    }

    selecionaItem(item: Element) {
        var label: Element = document.querySelector(".refeicao-tipo-tipoSelecionado-label") as Element;

        label.textContent = item.textContent
        this.mostraAlimentos()
    }

    mostraAlimentos() {
        var alimentos = document.querySelector(".alimentos") as HTMLElement
        alimentos.style.display = "flex"
    }

    trocaTipo(refeicao: string, tipo: string) {
        var abas = document.querySelectorAll(".abaSelecionavel") as NodeListOf<HTMLElement>
        for (let i = 1; i <= abas.length - 1; i++) {
            if (abas[i].getAttribute("value") == refeicao){
                abas[i].children[0].textContent = tipo
            }
        }
    }
}
export default RefeicaoView;