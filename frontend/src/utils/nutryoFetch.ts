class NutryoFetch {
    static objects: JSON
    constructor() {
        this.fetchObjects();
    }

    private async fetchObjects() {

        const resposta = await fetch("http://localhost:3001/refeicoes", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        let refeicoes = await resposta.json();
        NutryoFetch.objects = refeicoes
    }
}

export default NutryoFetch