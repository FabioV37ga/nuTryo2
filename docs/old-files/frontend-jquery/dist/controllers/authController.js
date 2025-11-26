var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import NutryoFetch from "../utils/nutryoFetch.js";
import AuthView from "../views/authView.js";
import { backend } from "../utils/connection.js";
class AuthController {
    constructor() {
        this.authView = new AuthView();
        this.adicionaEventosDeClick();
        this.verificaSessao();
    }
    verificaSessao() {
        return __awaiter(this, void 0, void 0, function* () {
            var sessao = JSON.parse(localStorage.getItem("sessaoNutryo"));
            if (sessao) {
                if (sessao.email && sessao.senha) {
                    const email = sessao.email;
                    const senha = sessao.senha;
                    const nome = sessao.nome;
                    const resposta = yield fetch(`${backend}/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "Application/json",
                        },
                        body: JSON.stringify({ email, senha })
                    });
                    if (resposta.ok) {
                        this.authView.definePerfil(sessao.email, nome);
                        const nutryo = new NutryoFetch(sessao.email, nome);
                        var intervalo = setInterval(() => {
                            if (NutryoFetch.objects) {
                                var tela = document.querySelector(".overlay-auth");
                                tela.style = "display: none";
                                var main = document.querySelector("main");
                                main.style.display = 'flex';
                                clearInterval(intervalo);
                            }
                        }, 1);
                    }
                }
            }
        });
    }
    adicionaEventosDeClick() {
        const trocaParaRegistro = document.querySelector(".switchToRegister");
        if (!trocaParaRegistro.classList.contains("hasEvent")) {
            trocaParaRegistro.classList.add("hasEvent");
            trocaParaRegistro.addEventListener("click", () => {
                this.authView.switchRegisterLogin("registro");
            });
        }
        const trocaParaLogin = document.querySelector(".switchToLogin");
        if (!trocaParaLogin.classList.contains("hasEvent")) {
            trocaParaLogin.classList.add("hasEvent");
            trocaParaLogin.addEventListener("click", () => {
                this.authView.switchRegisterLogin("login");
            });
        }
        const botaoLogin = document.querySelector(".submitLogin");
        if (!botaoLogin.classList.contains("hasEvent")) {
            botaoLogin.classList.add("hasEvent");
            botaoLogin.addEventListener("click", () => {
                this.logIn();
            });
        }
        const botaoRegister = document.querySelector(".submitRegistro");
        if (!botaoRegister.classList.contains("hasEvent")) {
            botaoRegister.classList.add("hasEvent");
            botaoRegister.addEventListener("click", () => {
                this.register();
            });
        }
    }
    logIn() {
        const self = this;
        const campoEmail = document.querySelector(".login-usuario");
        const campoSenha = document.querySelector(".login-senha");
        const email = campoEmail.value;
        const senha = campoSenha.value;
        if (email.length >= 7 &&
            email.includes("@") &&
            email.includes(".")) {
            if (senha.trim() != '') {
                efetuaLogin();
            }
            else {
                this.exibeMensagemDeAuth("login");
            }
        }
        else {
            this.exibeMensagemDeAuth("login");
        }
        function efetuaLogin() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    self.authView.toggleLoading();
                    const resposta = yield fetch(`${backend}/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "Application/json",
                        },
                        body: JSON.stringify({ email, senha })
                    });
                    const dados = yield resposta.json();
                    if (resposta.ok) {
                        var nome = dados.nome;
                        self.authView.definePerfil(dados.email, dados.nome);
                        localStorage.setItem("sessaoNutryo", JSON.stringify({ email, senha, nome }));
                        const nutryo = new NutryoFetch(dados.email, dados.nome);
                        var intervalo = setInterval(() => {
                            if (NutryoFetch.objects) {
                                var tela = document.querySelector(".overlay-auth");
                                tela.style = "display: none";
                                clearInterval(intervalo);
                            }
                        }, 1);
                    }
                    else {
                        self.exibeMensagemDeAuth("login");
                    }
                }
                catch (error) {
                    console.log(error);
                }
                finally {
                    self.authView.toggleLoading();
                }
            });
        }
    }
    register() {
        const self = this;
        const campoEmail = document.querySelector(".register-email");
        const campoNome = document.querySelector(".register-usuario");
        const campoSenha = document.querySelector(".register-senha");
        const email = campoEmail.value;
        const nome = campoNome.value;
        const senha = campoSenha.value;
        if (email.length >= 7 &&
            email.includes("@") &&
            email.includes(".")) {
            if (senha.trim() != '') {
                if (nome.trim() != '') {
                    efetuaRegistro();
                }
                else {
                    this.exibeMensagemDeAuth("register-nome");
                }
            }
            else {
                this.exibeMensagemDeAuth("register-senha");
            }
        }
        else {
            this.exibeMensagemDeAuth("register-mail");
        }
        function efetuaRegistro() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const resposta = yield fetch(`${backend}/auth/registro`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "Application/json",
                        },
                        body: JSON.stringify({ email, senha, nome })
                    });
                    if (resposta.status == 400) {
                        console.log("E-mail duplicado");
                        self.exibeMensagemDeAuth("email-duplicado");
                        return;
                    }
                    self.exibeMensagemDeAuth("sucess-register");
                    self.authView.definePerfil(email, nome);
                }
                catch (error) {
                    console.log("Erro no registro");
                }
            });
        }
    }
    exibeMensagemDeAuth(tipo) {
        const campoEmail = document.querySelector(".register-email");
        const mensagemLogin = document.querySelector(".login-erro");
        const mensagemRegistro = document.querySelector(".registro-erro");
        switch (tipo) {
            case "login":
                mensagemLogin.textContent = "Dados incorretos ou inexistentes!";
                mostraEEscondeMensagem(mensagemLogin);
                break;
            case "register-nome":
                mensagemRegistro.textContent = "Nome inválido.";
                mostraEEscondeMensagem(mensagemRegistro);
                break;
            case "register-mail":
                mensagemRegistro.textContent = "Email inválido";
                mostraEEscondeMensagem(mensagemRegistro);
                break;
            case "register-senha":
                mensagemRegistro.textContent = "Senha inválida";
                mostraEEscondeMensagem(mensagemRegistro);
                break;
            case "email-duplicado":
                mensagemRegistro.textContent = "Email já cadastrado!";
                campoEmail.value = "";
                mostraEEscondeMensagem(mensagemRegistro);
                break;
            case "sucess-register":
                this.authView.switchRegisterLogin("login");
                mensagemLogin.textContent = "Conta criada com sucesso! Faça o login.";
                mostraEEscondeMensagem(mensagemLogin);
                break;
        }
        function mostraEEscondeMensagem(elemento) {
            elemento.style.display = "initial";
            setTimeout(() => {
                elemento.style.display = "none";
            }, 3000);
        }
    }
}
export default AuthController;
