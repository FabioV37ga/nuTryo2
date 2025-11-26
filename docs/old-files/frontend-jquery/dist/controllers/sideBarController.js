class SideBarController {
    constructor() {
        this.adicionaEventosDeClick();
    }
    adicionaEventosDeClick() {
        var usuario = document.querySelector(".user");
        if (!usuario.classList.contains("hasEvent")) {
            usuario.classList.add("hasEvent");
            usuario.addEventListener("click", (e) => {
                e.stopPropagation;
                this.toggleUsuario();
            });
        }
        var logout = document.querySelector(".user-janela-logout");
        if (!logout.classList.contains("hasEvent")) {
            logout.classList.add("hasEvent");
            logout.addEventListener("click", () => {
                localStorage.removeItem("sessaoNutryo");
                location.reload();
            });
        }
        var closeUser = document.querySelector(".user-janela-close");
        if (!closeUser.classList.contains("hasEvent")) {
            closeUser.classList.add("hasEvent");
            closeUser.addEventListener("click", () => {
                this.toggleUsuario();
            });
        }
    }
    toggleUsuario() {
        var janelaUsuario = document.querySelector(".user-janela");
        if (janelaUsuario === null || janelaUsuario === void 0 ? void 0 : janelaUsuario.classList.contains("user-janela-aberta")) {
            janelaUsuario.classList.remove("user-janela-aberta");
        }
        else {
            janelaUsuario === null || janelaUsuario === void 0 ? void 0 : janelaUsuario.classList.add("user-janela-aberta");
        }
    }
}
export default SideBarController;
