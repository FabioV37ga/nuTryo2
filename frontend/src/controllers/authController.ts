import { AnyObject } from "mongoose";
import NutryoFetch from "../utils/nutryoFetch.js";
import AuthView from "../views/authView.js";

class AuthController {
    private authView = new AuthView()
    constructor() {
        this.adicionaEventosDeClick()
        this.verificaSessao()
    }

    async verificaSessao() {
        var sessao: AnyObject = JSON.parse(localStorage.getItem("sessaoNutryo") as string) as AnyObject

        if (sessao) {
            if (sessao.email && sessao.senha) {
                const email = sessao.email
                const senha = sessao.senha

                // Inicia requisição
                const resposta = await fetch("http://localhost:3001/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "Application/json",
                    },
                    body: JSON.stringify({ email, senha })
                })
                if (resposta.ok) {
                    // Realiza fetch dos dados referente ao usuário conectado
                    const nutryo = new NutryoFetch(sessao.email)

                    // Inicia aplicação fechando janela de autenticação
                    var intervalo = setInterval(() => {
                        if (NutryoFetch.objects) {
                            var tela = document.querySelector(".overlay-auth") as HTMLElement
                            tela.style = "display: none"
                            clearInterval(intervalo)
                        }
                    }, 1);
                }
            }
        }
    }

    adicionaEventosDeClick() {

        // # Adiciona evento para trocar a janela entre Registro e Login

        // Botão 'troca para registro'
        const trocaParaRegistro = document.querySelector(".switchToRegister") as HTMLElement;

        // Previne adição mútlipla de eventos de click
        if (!trocaParaRegistro.classList.contains("hasEvent")) {
            trocaParaRegistro.classList.add("hasEvent")

            trocaParaRegistro.addEventListener("click", () => {
                this.authView.switchRegisterLogin("registro")
            })
        }

        // Botão 'troca para login'
        const trocaParaLogin = document.querySelector(".switchToLogin") as HTMLElement

        // Previne adição mútlipla de eventos de click
        if (!trocaParaLogin.classList.contains("hasEvent")) {
            trocaParaLogin.classList.add("hasEvent")

            trocaParaLogin.addEventListener("click", () => {
                this.authView.switchRegisterLogin("login")
            })
        }


        // # Adiciona evento de click para efetuar login

        // Botão login
        const botaoLogin = document.querySelector(".submitLogin") as Element

        if (!botaoLogin.classList.contains("hasEvent")) {
            botaoLogin.classList.add("hasEvent")

            botaoLogin.addEventListener("click", () => {
                this.logIn()
            })
        }

        // # Adiciona evento de click para efetuar registro

        const botaoRegister = document.querySelector(".submitRegistro") as Element

        if (!botaoRegister.classList.contains("hasEvent")) {
            botaoRegister.classList.add("hasEvent")

            botaoRegister.addEventListener("click", () => {
                this.register()
            })
        }
    }

    private logIn() {
        // Referencia this em self
        const self = this;

        // Campos html referentes a email e senha
        const campoEmail = document.querySelector(".login-usuario") as HTMLFormElement
        const campoSenha = document.querySelector(".login-senha") as HTMLFormElement

        // Conteúdo dos inputs acima
        const email = campoEmail.value
        const senha = campoSenha.value

        // # Consistência de campo
        // Consistência de email
        if (email.length >= 7 &&
            email.includes("@") &&
            email.includes(".")
        ) {
            // Consistência de senha
            if (senha.trim() != '') {
                // Consistências bem-sucedidas, efetua login
                efetuaLogin()
            } else {
                // Exibe erro de login
                this.exibeMensagemDeAuth("login")
            }
        } else {
            // Exibe erro de login
            this.exibeMensagemDeAuth("login")
        }


        // # Função de login
        async function efetuaLogin() {
            try {
                // Animação de loading
                self.authView.toggleLoading()

                // Inicia requisição
                const resposta = await fetch("http://localhost:3001/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "Application/json",
                    },
                    body: JSON.stringify({ email, senha })
                })

                // Armazena em dados
                const dados = await resposta.json()

                // Se os dados forem validos, realiza login
                if (resposta.ok) {
                    localStorage.setItem("sessaoNutryo", JSON.stringify({ email, senha }))
                    // Realiza fetch dos dados referente ao usuário conectado
                    const nutryo = new NutryoFetch(dados.email)

                    // Inicia aplicação fechando janela de autenticação
                    var intervalo = setInterval(() => {
                        if (NutryoFetch.objects) {
                            var tela = document.querySelector(".overlay-auth") as HTMLElement
                            tela.style = "display: none"
                            clearInterval(intervalo)
                        }
                    }, 1);
                }
                // Se os dados forem invalidos, exibe mensagem de erro
                else {
                    console.log("falha no login")
                    self.exibeMensagemDeAuth("login")
                }
            } catch (error) {

            } finally {
                self.authView.toggleLoading()
            }

        }
    }

    private register() {
        // Referencia this em self, para usar dentro da função
        const self = this;

        // Campo html do email
        const campoEmail = document.querySelector(".register-email") as HTMLFormElement
        // Campo html do nome
        const campoNome = document.querySelector(".register-usuario") as HTMLFormElement
        // Campo html da senha
        const campoSenha = document.querySelector(".register-senha") as HTMLFormElement

        // Valor inserido nos campos
        const email = campoEmail.value
        const nome = campoNome.value
        const senha = campoSenha.value

        // # Consistência dos campos

        // Consistência do email
        if (email.length >= 7 &&
            email.includes("@") &&
            email.includes(".")
        ) {
            // Consistência da senha
            if (senha.trim() != '') {
                // Consistência do nome
                if (nome.trim() != '') {
                    // Se os 3 campos estiverem válidos, efetua registro
                    efetuaRegistro()
                } else {
                    // Emite erro de nome
                    this.exibeMensagemDeAuth("register-nome")
                }
            } else {
                // Emite erro de senha
                this.exibeMensagemDeAuth("register-senha")
            }
        } else {
            // Emite erro de email
            this.exibeMensagemDeAuth("register-mail")
        }

        // Função para efetuar registro
        async function efetuaRegistro() {

            try {
                // Faz requisição
                const resposta = await fetch("http://localhost:3001/auth/registro", {
                    method: "POST",
                    headers: {
                        "Content-Type": "Application/json",
                    },
                    body: JSON.stringify({ email, senha, nome })
                })

                // Error 400: Email duplicado
                if (resposta.status == 400) {
                    console.log("E-mail duplicado")
                    self.exibeMensagemDeAuth("email-duplicado")
                    return
                }
                // Sucesso: Exibe mensagem de registro bem-sucedido
                self.exibeMensagemDeAuth("sucess-register")
            } catch (error) {
                // Erro no registro
                console.log("Erro no registro")
            }

        }
    }

    private exibeMensagemDeAuth(tipo: string) {

        // Campo email
        const campoEmail = document.querySelector(".register-email") as HTMLFormElement

        // Campo de notificar erro do login
        const mensagemLogin = document.querySelector(".login-erro") as HTMLElement

        // Campo de notificar erro do registro
        const mensagemRegistro = document.querySelector(".registro-erro") as HTMLElement

        // Seleção do erro
        switch (tipo) {
            case "login":
                mensagemLogin.textContent = "Dados incorretos ou inexistentes!"
                mostraEEscondeMensagem(mensagemLogin)
                break;
            case "register-nome":
                mensagemRegistro.textContent = "Nome inválido."
                mostraEEscondeMensagem(mensagemRegistro)
                break
            case "register-mail":
                mensagemRegistro.textContent = "Email inválido"
                mostraEEscondeMensagem(mensagemRegistro)
                break
            case "register-senha":
                mensagemRegistro.textContent = "Senha inválida"
                mostraEEscondeMensagem(mensagemRegistro)
                break
            case "email-duplicado":
                mensagemRegistro.textContent = "Email já cadastrado!"
                campoEmail.value = ""
                mostraEEscondeMensagem(mensagemRegistro)
                break
            case "sucess-register":
                this.authView.switchRegisterLogin("login")
                mensagemLogin.textContent = "Conta criada com sucesso! Faça o login."
                mostraEEscondeMensagem(mensagemLogin)
                break
        }

        function mostraEEscondeMensagem(elemento: HTMLElement) {
            elemento.style.display = "initial"
            setTimeout(() => {
                elemento.style.display = "none"
            }, 3000);
        }
    }
}

export default AuthController