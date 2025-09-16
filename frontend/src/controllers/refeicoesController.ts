import diaObjeto from "../utils/diaObjeto.js";
import NutryoFetch from "../utils/nutryoFetch.js";
import RefeicoesView from "../views/refeicoesView.js"
import CalendarioController from "./calendarioController.js";
import JanelaController from "./janelaController.js";

class RefeicoesController extends JanelaController {
    refeicoesView: RefeicoesView = new RefeicoesView();
    refeicoesNaJanela: any[] = [];
    private botaoAdicionarRefeicao: Element;

    constructor() {
        // Inicializa herança
        super()
        // Chama função para adicionar eventos
        this.adicionaEventosDeClick();
    }


    protected adicionaEventosDeClick() {
        // Atribui elementos de refeição existentes para o atributo da classe
        this.itemRefeicao = document.querySelectorAll(".refeicao")

        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // Adiciona eventos para abrir uma janela ao clicar em adicionar e eventos de click para remover 

        // Loop para adicionar eventos em todos os elementos
        for (let i = 1; i <= this.itemRefeicao.length - 1; i++) {

            // Previne adição multipla de eventos de click
            if (!this.itemRefeicao[i].classList.contains("hasEvent")) {
                this.itemRefeicao[i].classList.add("hasEvent")

                // ---------------------------------------------------------------
                // Sessão lógica para criar aba de refeições (Ao ser criada, ou editada)
                // Adiciona eventos
                this.itemRefeicao[i].children[0].addEventListener("click", (e) => {
                    e.stopPropagation
                    var elementoClicado = e.currentTarget as HTMLElement

                    // Armazena titulo e id da refeição sendo manipulada
                    var titulo = this.itemRefeicao[i].textContent.toString().trim().split(" ")[0]
                    var id: number = Number(this.itemRefeicao[i].getAttribute("value"));

                    // Cria aba 
                    var abaCriada = this.refeicoesView.criaAba(titulo, id);

                    // Seleciona aba criada
                    this.refeicoesView.selecionaAba(abaCriada);

                    // Pendura o ID da refeição no elemento de tipo da refeição, auxiliando outras partes do código a acessar o ID
                    var tipo = document.querySelector(".refeicao-tipo") as HTMLElement
                    tipo.setAttribute("value", String(id))

                    // Adiciona eventos de click para elementos criados nesse trecho
                    this.adicionaEventosDeClick()
                    super.adicionaEventosDeClick()
                })

                // ---------------------------------------------------------------
                // Sessão lógica para remoção de refeições (Apagar na lista de refeições de um dia)
                this.itemRefeicao[i].children[2].addEventListener("click", (e) => {

                    // Armazena em 'item' a refeição a ser removida
                    var item = e.currentTarget as Element

                    // Apaga objeto da refeição especifica 
                    diaObjeto.apagarRefeicao(
                        item.parentElement?.getAttribute("value") as string
                    )

                    // Apaga visualmente a refeição da página
                    this.refeicoesView.removerRefeicao(item.parentElement as Element)

                })
            }
        }


        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // Adiciona eventos para criar uma instância (visual e lógica) de uma refeição

        // Armazena no atributo o botão de "Adicionar refeição"
        this.botaoAdicionarRefeicao = document.querySelector(".model-refeicao") as Element

        // Prefine adição mútipla de eventos de click
        if (!this.botaoAdicionarRefeicao.classList.contains("hasEvent")) {
            this.botaoAdicionarRefeicao.classList.add("hasEvent")

            // Adiciona eventos de click
            this.botaoAdicionarRefeicao.addEventListener("click", () => {

                // Armazena campo de alimentos
                var alimentos = document.querySelector(".alimentos") as HTMLElement
                // Esconde elementos (só mostra depois de selecionar o tipo da refeição)
                alimentos.style.display = "none"

                // Armazena campo "tipo"
                var tipo = document.querySelector(".refeicao-tipo") as HTMLElement
                // Define o texto como "Selecione o tipo" (somente em novas refeições)
                tipo.children[1].children[0].textContent = "Selecione o tipo"

                // Armazenas refeições existentes e criadas
                var itens = document.querySelectorAll(".refeicao") as NodeListOf<HTMLElement>
                // Define o ID a partir do ID da última refeição criada, se for a primeira, o id é 1.
                RefeicoesView._id = parseInt(itens[itens.length - 1].getAttribute("value") as string) + 1

                // Pendura o ID no elemento de TIPO, auxilia outras partes do código a terem acesso ao ID da refeição que está sendo manipulada
                tipo.setAttribute("value", String(RefeicoesView._id))
                
                // Adiciona visualmente a refeição
                this.refeicoesView.adicionarRefeicao()

                // Adiciona eventos de click a refeição criada
                this.adicionaEventosDeClick()
            })
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Função responsável por criar elementos de refeição de um dia
    criarElementosDoDia(data: string) {

        // Armazena elementos de refeição
        var refeicoesNoDOM = document.querySelectorAll(".refeicao")

        // Primeiro apaga todos que existirem na página (No caso do usuário trocar o dia)
        for (let refeicaoDOM = 1; refeicaoDOM <= refeicoesNoDOM.length - 1; refeicaoDOM++) {
            refeicoesNoDOM[refeicaoDOM].remove()
        }


        // Intervalo de busca (Só executa a lógica quando o status de busca for 1 - finalizado)
        var intervalo = setInterval(() => {
            
            if (NutryoFetch.status == 1) {

                // Chama função para retornar as refeições do dia selecionado
                var refeicoesDoDia = NutryoFetch.retornaRefeicoesDoDia(data) as any[]
                
                // Se houverem refeições no dia selecionado...
                if (refeicoesDoDia) {
                    // Chama função para criar elementos das refeições do dia
                    for (let refeicao = 0; refeicao <= refeicoesDoDia.length - 1; refeicao++) {
                        this.criarElementosDeRefeicao(refeicoesDoDia[refeicao])
                    }
                }
                // Limpa intervalo
                clearInterval(intervalo)
            }
        }, 1);
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------
    // # Função responsável por criar elementos de refeição
    criarElementosDeRefeicao(refeicao: any) {
        // Adiciona visualmente elemento de refeição
        this.refeicoesView.adicionarRefeicao(refeicao)
        // Adiciona eventos de click a refeição criada
        this.adicionaEventosDeClick()
    }
}

export default RefeicoesController