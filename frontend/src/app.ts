import CalendarioController from "./controllers/calendarioController.js"
import RefeicoesController from "./controllers/refeicoesController.js";
import RefeicaoController from "./controllers/refeicaoController.js";
import JanelaController from "./controllers/janelaController.js";
import AlimentoController from "./controllers/alimentoController.js";
import AuthController from "./controllers/authController.js";
import SideBarController from "./controllers/sideBarController.js";
import EstatisticasController from "./controllers/estatisticasController.js";


const janelaController = new JanelaController();
const authController = new AuthController();
const sideBarController = new SideBarController();
const calendarioController = new CalendarioController();
const alimentoController = new AlimentoController();
const refeicoesController = new RefeicoesController();
const refeicaoController = new RefeicaoController();
const estatisticasController = new EstatisticasController()

refeicoesController.criarElementosDoDia(CalendarioController.dataSelecionada)