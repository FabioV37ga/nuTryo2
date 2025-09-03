declare var $:any;

import JanelaView from "./janelaView.js";

class RefeicoesView extends JanelaView{
    constructor(){
        super()
    }
    
    removerRefeicao(refeicao:Element){
        refeicao.remove()
    }
}

export default RefeicoesView;