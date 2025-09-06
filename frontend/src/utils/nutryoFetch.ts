import { backend } from "../utils/connection.js"
class NutryoFetch {
    static objects: JSON
    private user: string;

    constructor(user: string) {
        this.user = user
        this.fetchObjects(this.user)
    }

    private async fetchObjects(user: string) {

        // console.log(`${backend}/refeicoes/${user}`)
        const resposta = await fetch(`${backend}/refeicoes/${user}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        let refeicoes = await resposta.json();
        NutryoFetch.objects = await refeicoes
    }
}

export default NutryoFetch