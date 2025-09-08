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
const alimentoController = new AlimentoController();
const refeicoesController = new RefeicoesController();
const refeicaoController = new RefeicaoController();
const authController = new AuthController();