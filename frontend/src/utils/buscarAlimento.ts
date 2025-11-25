/**
 * Utilitário para busca de alimentos na base de dados
 * 
 * Implementa debounce para evitar requisições excessivas
 * enquanto o usuário digita
 */

import { backend } from "./connection";

class BuscarAlimentos {
    // Timer para controle de debounce
    static searchDelay: any;

    /**
     * Busca alimentos por nome com debounce de 300ms
     * @param query - Nome ou parte do nome do alimento
     * @returns Promise com array de alimentos encontrados
     */
    static buscar(query: string): Promise<any[]> {
        return new Promise((resolve) => {
            // Cancela busca anterior se usuário ainda estiver digitando
            clearTimeout(BuscarAlimentos.searchDelay);

            // Aguarda 300ms após última digitação antes de fazer a requisição
            BuscarAlimentos.searchDelay = setTimeout(async () => {
                // Só faz requisição se query não estiver vazia
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
            }, 300); // Delay de 300ms
        });
    }
}

export default BuscarAlimentos;