import CalendarioController from "./controllers/calendarioController.js"
import RefeicoesController from "./controllers/refeicoesController.js";
import RefeicaoController from "./controllers/refeicaoController.js";
import JanelaController from "./controllers/janelaController.js";
import AlimentoController from "./controllers/alimentoController.js";
import NutryoFetch from "./utils/nutryoFetch.js";
import AuthController from "./controllers/authController.js";

// console.log("here")

const calendarioController = new CalendarioController();
const janelaController = new JanelaController();
const refeicoesController = new RefeicoesController();
const refeicaoController = new RefeicaoController();
const alimentoController = new AlimentoController();
const authController = new AuthController();

window.onload = ()=>{
    new NutryoFetch()
    var timer = 0;
    var intervalo = setInterval(() => {
        if (NutryoFetch.objects){
            timer++
            console.log("Fetch realizado em " + timer + "ms")
            console.log(NutryoFetch.objects)
            clearInterval(intervalo)
        }
    }, 1);
}