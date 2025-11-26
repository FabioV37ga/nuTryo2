import XLSX from "xlsx";
class AlimentoController {
    static carregarExcel() {
        const workbook = XLSX.readFile("api/src/data/alimentos.xlsx");
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        return data;
    }
    static listar(req, res) {
        res.json(AlimentoController.alimentos);
    }
    static buscarId(req, res) {
        const idParam = req.params.id;
        const id = Number(idParam);
        if (isNaN(id)) {
            return res.status(400).json({ erro: "ID inválido" });
        }
        const alimento = AlimentoController.alimentos.find(a => a.id === id);
        if (!alimento) {
            return res.status(404).json({ erro: "Alimento não encontrado" });
        }
        res.json(alimento);
    }
    static buscarNome(req, res) {
        const termo = (req.query.nome || "").toLowerCase();
        function normalizar(str) {
            return str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/,/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .toLowerCase();
        }
        const palavrasBusca = normalizar(termo).split(" ");
        const resultados = AlimentoController.alimentos.filter(alimento => {
            const palavrasNome = normalizar(alimento.nome).split(" ");
            return palavrasBusca.every(palavraBusca => palavrasNome.some(palavraNome => palavraNome.startsWith(palavraBusca)));
        });
        res.json(resultados);
    }
}
AlimentoController.alimentos = AlimentoController.carregarExcel();
export default AlimentoController;
