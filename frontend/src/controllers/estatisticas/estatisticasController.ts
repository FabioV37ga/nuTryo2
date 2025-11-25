class EstatisticasController {
    // Calcula a largura do input baseada no número de caracteres
    static calcularLarguraInput(valor: string | number): string {
        const texto = String(valor || '');
        const numCaracteres = texto.length || 1; // mínimo 1 para evitar width 0
        // cada caractere ocupa ~12px + 12px fixos adicionais
        const largura = Math.max(numCaracteres * 12 + 12, 42); // mínimo 42px (30 + 12)
        return `${largura}px`;
    }

    // Retorna o número de caracteres do valor (para cálculo)
    static contarCaracteres(valor: string | number): number {
        return String(valor || '').length || 1;
    }
}

export default EstatisticasController;
