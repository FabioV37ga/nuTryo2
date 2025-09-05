class AuthView {
    switchRegisterLogin(target: string) {
        
        // Janela de registro
        const janelaRegistro = document.querySelector(".auth-registro") as HTMLElement

        // Janela de login
        const janelaLogin = document.querySelector(".auth-login") as HTMLElement

        switch (target) {
            case "registro":
                janelaLogin.style.display = 'none'
                janelaRegistro.style.display = 'flex'
                break
            case "login":
                janelaRegistro.style.display = 'none'
                janelaLogin.style.display = 'flex'
                break;
        }
    }
}
export default AuthView