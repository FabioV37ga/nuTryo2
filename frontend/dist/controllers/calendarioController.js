import CalendarioView from "../views/calendarioView.js";
class CalendarioController {
    constructor() {
        this.calendarioView = new CalendarioView();
        console.log("CalendarioController Criado");
        this.calendarioView.criarElementos();
    }
}
export default CalendarioController;
