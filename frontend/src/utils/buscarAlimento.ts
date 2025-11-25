import { backend } from "./connection";

class BuscarAlimentos {
    static searchDelay: any;

    static buscar(query: string): Promise<any[]> {
        return new Promise((resolve) => {
            clearTimeout(BuscarAlimentos.searchDelay);

            BuscarAlimentos.searchDelay = setTimeout(async () => {
                if (query.replaceAll(" ", "") !== "") {
                    try {
                        const resposta = await fetch(`${backend}/alimentos/buscar?nome=${query}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });
                        const data = await resposta.json();
                        resolve(Array.isArray(data) ? data : []);
                    } catch (erro) {
                        console.error('Erro na busca:', erro);
                        resolve([]);
                    }
                } else {
                    resolve([]);
                }
            }, 300);
        });
    }
}

export default BuscarAlimentos;