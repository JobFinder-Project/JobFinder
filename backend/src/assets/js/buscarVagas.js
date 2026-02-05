import { arrowsCategories } from "./setasCategorias.js";
import { setupCategoryFilter } from "./filtroCategorias.js";

document.addEventListener('DOMContentLoaded', () => {
    const categoriesList = document.getElementById('categoriesList');
    const left = document.getElementById('catLeft');
    const right = document.getElementById('catRight');

    // Inicialização do filtro de categorias
    setupCategoryFilter(categoriesList);

    // Inicialização das setas de navegação das categorias
    arrowsCategories(categoriesList, left, right);
});