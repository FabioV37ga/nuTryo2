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
    }

    private logIn() {
        const campoEmail = document.querySelector(".login-usuario") as HTMLFormElement
        const campoSenha = document.querySelector(".login-senha") as HTMLFormElement

        const email = campoEmail.value
        const senha = campoSenha.value
        console.log(campoEmail)

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

            if (resposta.ok){
                console.log("Login realizado")
            }else{
                console.log("falha no login")
            }
        }
    }

    private exibeErroDeAuth(tipo: string) {

    }
}

export default AuthController