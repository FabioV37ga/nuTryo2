import CalendarioView from "../views/calendarioView.js";
class CalendarioController{
    private calendarioView = new CalendarioView();
    constructor(){
        console.log("CalendarioController Criado")
        this.calendarioView.criarElementos()
    }
}

export default CalendarioController;