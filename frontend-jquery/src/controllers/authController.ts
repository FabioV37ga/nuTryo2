import { AnyObject } from "mongoose";
import NutryoFetch from "../utils/nutryoFetch.js";
import AuthView from "../views/authView.js";
import { backend } from "../utils/connection.js"

class AuthController {
    private authView:AuthView;

    constructor() {
        this.authView = new AuthView()
        // Adiciona funções de click
        this.adicionaEventosDeClick()
        // Verifica se há sessão salva no cache, dispensa login
        this.verificaSessao()
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Função resposável por verificar sessão no cache, dispensa login se houver
    async verificaSessao() {

        // Pega item salvo no cache
        var sessao: AnyObject = JSON.parse(localStorage.getItem("sessaoNutryo") as string) as AnyObject

        // Se houver sessão salva no cache...
        if (sessao) {
            if (sessao.email && sessao.senha) {
                const email = sessao.email
                const senha = sessao.senha
                const nome = sessao.nome

                // Inicia requisição com dados do cache
                const resposta = await fetch(`${backend}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "Application/json",
                    },
                    body: JSON.stringify({ email, senha })
                })
                // Se houver match com a sessão salva no cache...
                if (resposta.ok) {
                    // Chama função para definir informações do perfil
                    this.authView.definePerfil(sessao.email, nome)

                    // Realiza fetch dos dados referente ao usuário conectado
                    const nutryo = new NutryoFetch(sessao.email, nome)

                    // Inicia aplicação fechando janela de autenticação
                    var intervalo = setInterval(() => {
                        if (NutryoFetch.objects) {

                            // Esconde janela de autenticação
                            var tela = document.querySelector(".overlay-auth") as HTMLElement
                            tela.style = "display: none"

                            // Mostra janela principal da aplicação
                            var main = document.querySelector("main") as HTMLElement
                            main.style.display = 'flex'

                            // limpa intervalo
                            clearInterval(intervalo)
                        }
                    }, 1);
                }
            }
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // Método responsável por adicionar funções de click
    adicionaEventosDeClick() {


        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # Adiciona evento para trocar a janela de LOGIN para REGISTRO

        // Botão 'troca para registro'
        const trocaParaRegistro = document.querySelector(".switchToRegister") as HTMLElement;

        // Previne adição mútlipla de eventos de click
        if (!trocaParaRegistro.classList.contains("hasEvent")) {
            trocaParaRegistro.classList.add("hasEvent")

            // Adiciona eventos
            trocaParaRegistro.addEventListener("click", () => {
                // Alterna visualmente entre login e registro na janela de autenticação
                this.authView.switchRegisterLogin("registro")
            })
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # Adiciona evento para trocar a janela de REGISTRO para LOGIN

        // Botão 'troca para login'
        const trocaParaLogin = document.querySelector(".switchToLogin") as HTMLElement

        // Previne adição mútlipla de eventos de click
        if (!trocaParaLogin.classList.contains("hasEvent")) {
            trocaParaLogin.classList.add("hasEvent")

            // Adiciona eventos
            trocaParaLogin.addEventListener("click", () => {
                // Alterna visualmente entre login e registro na janela de autenticação
                this.authView.switchRegisterLogin("login")
            })
        }


        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # Adiciona evento de click para efetuar login

        // Botão login
        const botaoLogin = document.querySelector(".submitLogin") as Element

        // Previne adição múltipla de eventos de click
        if (!botaoLogin.classList.contains("hasEvent")) {
            botaoLogin.classList.add("hasEvent")

            // Adiciona eventos
            botaoLogin.addEventListener("click", () => {
                // Efetua login ao clicar
                this.logIn()
            })
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # Adiciona evento de click para efetuar registro

        // Botão de registro
        const botaoRegister = document.querySelector(".submitRegistro") as Element

        // Previne adição múltipla de eventos de click
        if (!botaoRegister.classList.contains("hasEvent")) {
            botaoRegister.classList.add("hasEvent")

            // Adiciona eventos
            botaoRegister.addEventListener("click", () => {
                // Efetua registro ao clicar
                this.register()
            })
        }
    }


    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método reponsável por verificar consistencia dos campos de login
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


        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # Função de login
        async function efetuaLogin() {
            try {
                // Animação de loading
                self.authView.toggleLoading()

                // Inicia requisição
                const resposta = await fetch(`${backend}/auth/login`, {
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

                    // Salva nome do usuário
                    var nome = dados.nome

                    // Chama função para definir informações do perfil
                    self.authView.definePerfil(dados.email, dados.nome)

                    // Salva sessão e cache
                    localStorage.setItem("sessaoNutryo", JSON.stringify({ email, senha, nome }))

                    // Realiza fetch dos dados referente ao usuário conectado
                    const nutryo = new NutryoFetch(dados.email, dados.nome)

                    // Inicia aplicação fechando janela de autenticação
                    var intervalo = setInterval(() => {
                        if (NutryoFetch.objects) {
                            // Tela de autenticação
                            var tela = document.querySelector(".overlay-auth") as HTMLElement

                            // Esconde tela de autenticação
                            tela.style = "display: none"

                            // Limpa intervalo
                            clearInterval(intervalo)
                        }
                    }, 1);
                }
                // Se os dados forem invalidos, exibe mensagem de erro
                else {
                    // Exbe mensagem de erro
                    self.exibeMensagemDeAuth("login")
                }
            } catch (error) {
                console.log(error)
            } finally {
                // Esconde tela de carregamento
                self.authView.toggleLoading()
            }

        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Função resposavel por garantir consistência dos campos de registro
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

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # Função para efetuar registro
        async function efetuaRegistro() {

            try {
                // Faz requisição
                const resposta = await fetch(`${backend}/auth/registro`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "Application/json",
                    },
                    body: JSON.stringify({ email, senha, nome })
                })

                // Error 400: Email duplicado
                if (resposta.status == 400) {
                    console.log("E-mail duplicado")
                    // Exibe mensagem de erro de email já existente
                    self.exibeMensagemDeAuth("email-duplicado")
                    return
                }
                // Sucesso: Exibe mensagem de registro bem-sucedido
                self.exibeMensagemDeAuth("sucess-register")

                //  Chama função para definir informações do perfil
                self.authView.definePerfil(email, nome)
            } catch (error) {
                // Erro no registro
                console.log("Erro no registro")
            }

        }
    }


    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por exibir informações sobre o login e registro
    private exibeMensagemDeAuth(tipo: string) {

        // Campo email
        const campoEmail = document.querySelector(".register-email") as HTMLFormElement

        // Campo de notificar erro do login
        const mensagemLogin = document.querySelector(".login-erro") as HTMLElement

        // Campo de notificar erro do registro
        const mensagemRegistro = document.querySelector(".registro-erro") as HTMLElement

        // Seleção do erro
        switch (tipo) {
            // Erro de login: dados incorretos ou inexistentes
            case "login":
                mensagemLogin.textContent = "Dados incorretos ou inexistentes!"
                mostraEEscondeMensagem(mensagemLogin)
                break;
            // Erro de registro: Nome inválido
            case "register-nome":
                mensagemRegistro.textContent = "Nome inválido."
                mostraEEscondeMensagem(mensagemRegistro)
                break
            // Erro de registro: Email inválido
            case "register-mail":
                mensagemRegistro.textContent = "Email inválido"
                mostraEEscondeMensagem(mensagemRegistro)
                break
            // Erro de registro: Senha inválida
            case "register-senha":
                mensagemRegistro.textContent = "Senha inválida"
                mostraEEscondeMensagem(mensagemRegistro)
                break
            // Erro de registro: Email já registrado
            case "email-duplicado":
                mensagemRegistro.textContent = "Email já cadastrado!"
                campoEmail.value = ""
                mostraEEscondeMensagem(mensagemRegistro)
                break
            // Sucesso em registro: Conta criada
            case "sucess-register":
                this.authView.switchRegisterLogin("login")
                mensagemLogin.textContent = "Conta criada com sucesso! Faça o login."
                mostraEEscondeMensagem(mensagemLogin)
                break
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # Mostra mensagem por 3 segundos, depois esconde
        function mostraEEscondeMensagem(elemento: HTMLElement) {
            // Mostra mensagem
            elemento.style.display = "initial"
            // Depois de 3 segundos esconde
            setTimeout(() => {
                elemento.style.display = "none"
            }, 3000);
        }
    }
}

export default AuthController