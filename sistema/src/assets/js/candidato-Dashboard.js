document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('candidaturasModal');
    const openModalBtn = document.getElementById('openCandidaturasModalBtn');
    const closeButton = document.querySelector('.close-button');
    const candidaturasList = document.getElementById('candidaturas-list');
    
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
                candidaturas.forEach(candidatura => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('candidatura-item');
                    
                    const dataFormatada = new Date(candidatura.createdAt).toLocaleDateString('pt-BR');

                    listItem.innerHTML = `
                        <h3>${candidatura.vaga.nome}</h3>
                        <p><strong>Empresa:</strong> ${candidatura.empresa.nome}</p>
                        <p><strong>Data da candidatura:</strong> ${dataFormatada}</p>
                    `;
                    candidaturasList.appendChild(listItem);
                });
            }
            
            modal.style.display = 'flex';

        } catch (error) {
            console.error('Erro:', error);
            candidaturasList.innerHTML = `<p class="no-candidaturas-message">Erro ao exibi as condidaturas.</p>`;
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

    candidaturas.forEach(candidatura => {
    const listItem = document.createElement('li');
    listItem.classList.add('candidatura-item');
    
    const dataFormatada = new Date(candidatura.createdAt).toLocaleDateString('pt-BR');

    listItem.innerHTML = `
        <h3>${candidatura.vaga.nome}</h3>
        <p><strong>Empresa:</strong> ${candidatura.empresa.nome}</p>
        <p><strong>Status:</strong> ${candidatura.status}</p> <p><strong>Data da candidatura:</strong> ${dataFormatada}</p>
    `;
    candidaturasList.appendChild(listItem);
});
});