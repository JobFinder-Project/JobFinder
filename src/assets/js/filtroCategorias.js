function filtroVagasPorCategoria(category) {
    const cards = document.querySelectorAll('.job-card');
    if (!category) {
        // Mostra todos os cards se não houver categoria ativa
        cards.forEach(card => card.style.display = '');
        return;
    }
    // Filtra os cards pela categoria selecionada
    cards.forEach(card => {
        const areaElement = card.querySelector('.job-area');
        const area = areaElement ? areaElement.textContent.trim() : '';
        if (area === category) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Filtro de vagas por categoria
export function setupCategoryFilter(categoriesList) {
    categoriesList.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-chip')) {
            
            const activeBtn = categoriesList.querySelector('.category-chip.active');
            const clickedBtn = e.target;
            const category = clickedBtn.textContent.trim();

            // Se já está ativa, desativa e mostra todos
            if (activeBtn === clickedBtn) {
                clickedBtn.classList.remove('active');
                filtroVagasPorCategoria('');
            } else {
                categoriesList.querySelectorAll('.category-chip').forEach(btn => btn.classList.remove('active'));
                clickedBtn.classList.add('active');
                filtroVagasPorCategoria(category);
            }
        }
    });
    filtroVagasPorCategoria('');
}