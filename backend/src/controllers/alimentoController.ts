import { Request, Response } from "express";
import XLSX from "xlsx";

// Tipo do alimento
interface Alimento {
    nome: string;
    calorias?: string;
    proteinas?: string;
    lipidios?: string;
    colesterol?: string;
    carboidrato?: string
}

export default class AlimentoController {
    private static alimentos: Alimento[] = AlimentoController.carregarExcel();

    // Carregar Excel na memória
    private static carregarExcel(): Alimento[] {
        const workbook = XLSX.readFile("backend/src/data/alimentos.xlsx");
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data: Alimento[] = XLSX.utils.sheet_to_json(sheet);
        return data;
    }

    // Listar todos os alimentos
    static listar(req: Request, res: Response) {
        res.json(AlimentoController.alimentos);
    }

    // Busca simples por substring (case-insensitive)
    static buscar(req: Request, res: Response) {
        const termo = ((req.query.nome as string) || "").toLowerCase();

        const resultados = AlimentoController.alimentos.filter(alimento =>
            alimento.nome.toLowerCase().includes(termo)
        );

        res.json(resultados);
    }

    // Busca "fuzzy" aproximada (usando includes simples)
    static buscarFuzzy(req: Request, res: Response) {
        const termo = ((req.query.nome as string) || "").toLowerCase();

        // Função de normalização
        function normalizar(str: string) {
            return str
                .normalize("NFD")             // remove acentos
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/,/g, " ")           // vírgulas viram espaço
                .replace(/\s+/g, " ")         // múltiplos espaços viram um
                .trim()
                .toLowerCase();
        }

        const palavrasBusca = normalizar(termo).split(" ");

        const resultados = AlimentoController.alimentos.filter(alimento => {
            const palavrasNome = normalizar(alimento.nome).split(" ");
            // Verifica se todas as palavras do termo estão no nome (em qualquer ordem)
            return palavrasBusca.every(palavra => palavrasNome.includes(palavra));
        });

        res.json(resultados);
    }
}