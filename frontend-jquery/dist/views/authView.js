class AuthView {
    switchRegisterLogin(target) {
        const janelaRegistro = document.querySelector(".auth-registro");
        const janelaLogin = document.querySelector(".auth-login");
        switch (target) {
            case "registro":
                janelaLogin.style.display = 'none';
                janelaRegistro.style.display = 'flex';
                break;
            case "login":
                janelaRegistro.style.display = 'none';
                janelaLogin.style.display = 'flex';
                break;
        }
    }
    toggleLoading() {
        const spinner = document.querySelector(".auth-loading");
        const janelaAuth = document.querySelector(".auth-janela");
        if (!janelaAuth.classList.contains("blur")) {
            janelaAuth.classList.add("blur");
            spinner.style.display = "initial";
        }
        else {
            janelaAuth.classList.remove("blur");
            spinner.style.display = "none";
        }
    }
    definePerfil(email, nome) {
        var campoEmail = document.querySelector(".user-janela-email span");
        campoEmail.textContent = email;
        var campoNome = document.querySelector(".user-janela-nome span");
        campoNome.textContent = nome;
    }
}
export default AuthView;
