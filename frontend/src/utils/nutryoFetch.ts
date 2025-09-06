class NutryoFetch {
    static objects: JSON
    private user:string;

    constructor(user:string){
        this.user = user
        this.fetchObjects(this.user)
    }
    
    private async fetchObjects(user:string) {

        console.log(`http://localhost:3001/refeicoes/${user}`)
        const resposta = await fetch(`http://localhost:3001/refeicoes/${user}`, {
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