declare var $:any;

class RefeicaoView{
    toggleListaDeTipos(){
        const listaTipoLabel:Element = document.querySelector(".refeicao-tipo-tipoSelecionado") as Element;
        const listaTipos:Element = document.querySelector(".refeicao-tipo-list") as Element;
        
        console.log(listaTipos)
        if (listaTipos.classList.contains("listaTipoFechada")){
            listaTipos.classList.remove("listaTipoFechada")
            listaTipos.classList.add("listaTipoAberta")
        }
        else if(listaTipos.classList.contains("listaTipoAberta")){
            listaTipos.classList.remove("listaTipoAberta")
            listaTipos.classList.add("listaTipoFechada")
        }
    }

    selecionaItem(item:Element){
        var label:Element = document.querySelector(".refeicao-tipo-tipoSelecionado-label") as Element;
        
        label.textContent = item.textContent
    }
}
export default RefeicaoView;