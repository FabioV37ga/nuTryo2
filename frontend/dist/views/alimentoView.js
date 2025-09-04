class AlimentoView {
    adicionarAlimento() {
        const elemento = `<div class="alimento-item">
                <a class="botao-editar-alimento">
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                </a>
                <span class="alimento-label">Arroz • 100g • 130kcal • 4g Proteínas • 30g Carboidratos • 2g
                    Gorduras
                </span>
                <div class="botao-apagar-alimento">
                    <i class="fa fa-trash" aria-hidden="true"></i>
            </div>`;
        $(".alimentos-adicionados").append(elemento);
    }
    apagarAlimento(elemento) {
        elemento.remove();
    }
}
export default AlimentoView;
