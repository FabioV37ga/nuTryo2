class SideBarController{
    constructor(){
        this.adicionaEventosDeClick()
    }

    adicionaEventosDeClick(){
        var usuario = document.querySelector(".user") as HTMLElement

        if (!usuario.classList.contains("hasEvent")){
            usuario.classList.add("hasEvent")

            usuario.addEventListener("click", (e)=>{
                e.stopPropagation
                this.toggleUsuario()
            })
        }

        var logout = document.querySelector(".user-janela-logout") as HTMLElement
        if (!logout.classList.contains("hasEvent")){
            logout.classList.add("hasEvent")

            logout.addEventListener("click", ()=>{
                localStorage.removeItem("sessaoNutryo")
                location.reload()
            })
        }

        var closeUser = document.querySelector(".user-janela-close") as HTMLElement
        if (!closeUser.classList.contains("hasEvent")){
            closeUser.classList.add("hasEvent")

            closeUser.addEventListener("click", ()=>{
                this.toggleUsuario()
            })
        }


    }

    toggleUsuario(){
        var janelaUsuario = document.querySelector(".user-janela")

        if (janelaUsuario?.classList.contains("user-janela-aberta")){
            janelaUsuario.classList.remove("user-janela-aberta")
        }else{
            janelaUsuario?.classList.add("user-janela-aberta")
        }
    }
}

export default SideBarController