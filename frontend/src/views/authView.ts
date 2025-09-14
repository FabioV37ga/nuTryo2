class AuthView {
    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por alternar visualmente entre a janela de registro e login
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

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável alternar a visualização do loading
    toggleLoading(){
        const spinner = document.querySelector(".auth-loading") as HTMLElement

        const janelaAuth = document.querySelector(".auth-janela") as HTMLElement

        if (!janelaAuth.classList.contains("blur")){
            janelaAuth.classList.add("blur")
            spinner.style.display = "initial"
        }else{
            janelaAuth.classList.remove("blur")
            spinner.style.display = "none"
        }
    }
}
export default AuthView