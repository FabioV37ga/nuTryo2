import NutryoFetch from "../utils/nutryoFetch.js";
import AuthView from "../views/authView.js";

class AuthController {
    private authView = new AuthView
    constructor() {
        this.adicionaEventosDeClick()
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
        const campoEmail = document.querySelector(".login-usuario") as HTMLFormElement
        const campoSenha = document.querySelector(".login-senha") as HTMLFormElement

        const email = campoEmail.value
        const senha = campoSenha.value

        // Consistência de campo
        if (email.length >= 7 &&
            email.includes("@") &&
            email.includes(".")
        ) {
            if (senha.trim() != '') {
                efetuaLogin()
            } else {
                this.exibeErroDeAuth("login")
            }
        } else {
            this.exibeErroDeAuth("login")
        }

        async function efetuaLogin() {
            const resposta = await fetch("http://localhost:3001/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "Application/json",
                },
                body: JSON.stringify({ email, senha })
            })

            const dados = await resposta.json()

            if (resposta.ok) {
                console.log("Login realizado")
                console.log(dados.email)
                const nutryo = new NutryoFetch(dados.email)

                var intervalo = setInterval(() => {
                    if (NutryoFetch.objects) {
                        console.log(NutryoFetch.objects)
                        clearInterval(intervalo)
                    }
                }, 1);
            } else {
                console.log("falha no login")
                this.exibeErroDeAuth("login")
            }
        }
    }

    private register() {
        const campoEmail = document.querySelector(".register-usuario") as HTMLFormElement
        const campoNome = document.querySelector(".register-usuario") as HTMLFormElement
        const campoSenha = document.querySelector(".register-senha") as HTMLFormElement

        const email = campoEmail.value
        const nome = campoNome.value
        const senha = campoSenha.value

        // Consistência de campo
        if (email.length >= 7 &&
            email.includes("@") &&
            email.includes(".")
        ) {
            if (senha.trim() != '') {
                if (nome.trim() != '') {
                    efetuaRegistro()
                } else {
                    this.exibeErroDeAuth("register-nome")
                }
            } else {
                this.exibeErroDeAuth("register-senha")
            }
        } else {
            this.exibeErroDeAuth("register-mail")
        }

        async function efetuaRegistro() {
            const resposta = await fetch("http://localhost:3001/auth/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "Application/json",
                },
                body: JSON.stringify({ email, senha, nome })
            })
        }
    }

    private exibeErroDeAuth(tipo: string) {

        // Campo de notificar erro do login
        const mensagemLogin = document.querySelector(".login-erro") as HTMLElement

        // Campo de notificar erro do registro
        const mensagemRegistro = document.querySelector(".registro-erro") as HTMLElement

        // Seleção do erro
        switch (tipo) {
            case "login":
                mensagemLogin.textContent = "Dados incorretos ou inexistentes!"
                mostraEEscondeErro(mensagemLogin)
                break;
        }

        function mostraEEscondeErro(elemento: HTMLElement) {
            elemento.style.display = "initial"
            setTimeout(() => {
                elemento.style.display = "none"
            }, 2000);
        }
    }
}

export default AuthController