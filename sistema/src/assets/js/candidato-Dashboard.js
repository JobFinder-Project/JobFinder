document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('candidaturasModal');
    const openModalBtn = document.getElementById('openCandidaturasModalBtn');
    const closeButton = document.querySelector('.close-button');
    const candidaturasList = document.getElementById('candidaturas-list');
    
    const templateSource = document.getElementById('candidatura-template').innerHTML;

    const fetchCandidaturas = async () => {
        try {
            const response = await fetch('/candidato/candidaturas'); 
            
            if (!response.ok) {
                throw new Error('Falha ao buscar candidaturas');
            }

            const candidaturas = await response.json();
            
            candidaturasList.innerHTML = '';

            if (candidaturas.length === 0) {
                candidaturasList.innerHTML = `<p class="no-candidaturas-message">Você ainda não possui candidaturas ativas.</p>`;
            } else {
                let finalHtml = '';
                
                candidaturas.forEach(candidatura => {
                    const dataFormatada = new Date(candidatura.createdAt).toLocaleDateString('pt-BR');
                    
                    let itemHtml = templateSource
                        .replace('{{vaga.nome}}', candidatura.vaga.nome)
                        .replace('{{empresa.nome}}', candidatura.empresa.nome)
                        .replace('{{status}}', candidatura.status)
                        .replace('{{dataFormatada}}', dataFormatada);
                    
                    finalHtml += itemHtml; 
                });
                
                candidaturasList.innerHTML = finalHtml;
            }
            
            modal.style.display = 'flex';

        } catch (error) {
            console.error('Erro:', error);
            candidaturasList.innerHTML = `<p class="no-candidaturas-message">Erro ao exibir as candidaturas.</p>`;
            modal.style.display = 'flex';
        }
    };

    openModalBtn.addEventListener('click', fetchCandidaturas);

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});