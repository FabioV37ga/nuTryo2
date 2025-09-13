class SideBarController {
    constructor() {
        // Chama método para adicionar eventos de click
        this.adicionaEventosDeClick()
    }

    adicionaEventosDeClick() {
        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # Adiciona eventos para mostrar/ esconder janela de usuário

        // Armazena elemento de usuário na variavel "usuario"
        var usuario = document.querySelector(".user") as HTMLElement

        // Prefine adição multipla de eventos de click
        if (!usuario.classList.contains("hasEvent")) {
            usuario.classList.add("hasEvent")

            // Adiciona evento de click
            usuario.addEventListener("click", (e) => {
                e.stopPropagation
                // Chama função para mostrar/ esconder janela de usuario
                this.toggleUsuario()
            })
        }

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        //  # Adiciona eventos para fazer logout da conta conectada

        // armazena botão de logout em "logout"
        var logout = document.querySelector(".user-janela-logout") as HTMLElement

        // Previne adição multipla de eventos de click
        if (!logout.classList.contains("hasEvent")) {
            logout.classList.add("hasEvent")

            // Adiciona eventos de click
            logout.addEventListener("click", () => {
                // Remove sessão do cache
                localStorage.removeItem("sessaoNutryo")
                // atualiza página
                location.reload()
            })
        }
        
        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // # Adiciona eventos para fechar a janela de usuário

        // Armazena "X" da janela de usuário em "closeUser"
        var closeUser = document.querySelector(".user-janela-close") as HTMLElement

        // Previne adição multipla de eventos de click
        if (!closeUser.classList.contains("hasEvent")) {
            closeUser.classList.add("hasEvent")

            // Adiciona eventos de click
            closeUser.addEventListener("click", () => {
                // Chama função para fechar a janela de usuário
                this.toggleUsuario()
            })
        }


    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Método responsável por mostrar e esconder a janela de usuário
    toggleUsuario() {

        // Armazena janela do usuário em "janelaUsuario"
        var janelaUsuario = document.querySelector(".user-janela")

        // Se a janela estiver aberta, fecha ela
        if (janelaUsuario?.classList.contains("user-janela-aberta")) {
            janelaUsuario.classList.remove("user-janela-aberta")
        } 
        // Se a janela estiver fechada, abre ela
        else {
            janelaUsuario?.classList.add("user-janela-aberta")
        }
    }
}

export default SideBarController