export function arrowsCategories(list, left, right) {
    let offset = 0;
    const step = 120; // pixels to scroll per click

    function atualizaVisibilidadeSetas() {
        // Só mostra as setas se houver overflow horizontal
        if (list.scrollWidth > list.clientWidth) {
            left.style.display = 'flex';
            right.style.display = 'flex';
        } else {
            left.style.display = 'none';
            right.style.display = 'none';
            // Reseta o scroll se não houver overflow
            list.scrollLeft = 0;
        }
        atualizaEstadoSetas();
    }

    // Atualiza o estado (ativado/desativado) das setas
    function atualizaEstadoSetas() {
        left.classList.toggle('disabled', list.scrollLeft === 0);
        right.classList.toggle('disabled', list.scrollLeft + list.clientWidth >= list.scrollWidth);
    }

    // Função para arrastar o scroll ao clicar nas setas
    function arrastarScroll(event) {
        event.preventDefault();
        if (event.currentTarget.id === 'catLeft') {
            list.scrollLeft -= step;
        } else {
            list.scrollLeft += step;
        }
        setTimeout(atualizaEstadoSetas, 100);
    }

    // Inicializa o estado das setas e o scroll
    function inicializaSeta() {
        list.scrollLeft = 0;
        atualizaVisibilidadeSetas();
    }

    // Chama ao carregar e ao redimensionar a tela
    //document.addEventListener('DOMContentLoaded', inicializaSeta);
    window.addEventListener('resize', inicializaSeta);
    left.addEventListener('click', arrastarScroll);
    right.addEventListener('click', arrastarScroll);
    list.addEventListener('scroll', atualizaEstadoSetas);
    inicializaSeta();
}