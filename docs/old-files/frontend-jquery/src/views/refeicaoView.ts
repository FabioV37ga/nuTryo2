declare var $: any;

class RefeicaoView {
    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por alternar visualização da dos itens da lista de tipos de refeição
    toggleListaDeTipos() {
        
        // Elemento da lista de tipos do DOM
        const listaTipos: Element = document.querySelector(".refeicao-tipo-list") as Element;

        // Se a lista estiver fechada, abre
        if (listaTipos.classList.contains("listaTipoFechada")) {
            listaTipos.classList.remove("listaTipoFechada")
            listaTipos.classList.add("listaTipoAberta")
        }

        // Se a lista estiver aberta, fecha
        else if (listaTipos.classList.contains("listaTipoAberta")) {
            listaTipos.classList.remove("listaTipoAberta")
            listaTipos.classList.add("listaTipoFechada")
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por selecionar visualmente um item da lista de tipos de item
    selecionaItem(item: Element) {
        // Elemento do label (string do tipo selecionado)
        var label: Element = document.querySelector(".refeicao-tipo-tipoSelecionado-label") as Element;

        // Altera o item selecionado para a string do elemento passado como parametro
        label.textContent = item.textContent

        // Chama método para mostrar a sessão alimentos
        this.mostraAlimentos()
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por mostrar a sessão de adição, edição e remoção de alimentos (só mostra depois de selecionar o tipo)
    mostraAlimentos() {
        // Elemento da sessão de adição, edição e remoção de alimentos
        var alimentos = document.querySelector(".alimentos") as HTMLElement

        // Estiliza para aparecer
        alimentos.style.display = "flex"
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por trocar visualmente o tipo da refeição
    trocaTipo(refeicao: string, tipo: string) {
        // Elemento de abas da janela
        var abas = document.querySelectorAll(".abaSelecionavel") as NodeListOf<HTMLElement>

        // Adiciona lógica para todas as abas abertas...
        for (let i = 1; i <= abas.length - 1; i++) {
            // Se a aba for de refeição
            if (abas[i].getAttribute("value") == refeicao){
                // Define o nome da aba para o tipo da refeição
                abas[i].children[0].textContent = tipo
            }
        }
    }
}
export default RefeicaoView;