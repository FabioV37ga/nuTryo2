import CalendarioController from "./controllers/calendarioController.js"
import RefeicoesController from "./controllers/refeicoesController.js";
import RefeicaoController from "./controllers/refeicaoController.js";
import JanelaController from "./controllers/janelaController.js";
import AlimentoController from "./controllers/alimentoController.js";
import NutryoFetch from "./utils/nutryoFetch.js";
import AuthController from "./controllers/authController.js";
import JanelaView from "./views/janelaView.js";

// console.log("here")

const janelaController = new JanelaController();
const authController = new AuthController();
const calendarioController = new CalendarioController();
const alimentoController = new AlimentoController();
const refeicoesController = new RefeicoesController();
const refeicaoController = new RefeicaoController();