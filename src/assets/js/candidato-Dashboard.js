document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('candidaturasModal');
    const modalTitle = document.getElementById('modal-title');
    const openModalBtn = document.getElementById('openCandidaturasModalBtn');
    const closeButton = modal.querySelector('.close-button');
    const candidaturasList = document.getElementById('candidaturas-list');
    const modalFooter = modal.querySelector('.modal-footer');
    const visualizarBtn = document.getElementById('visualizar-btn');

    const listaView = document.getElementById('lista-view');
    const detalheView = document.getElementById('detalhe-view');
    const confirmacaoView = document.getElementById('confirmacao-view');
    const resultadoView = document.getElementById('resultado-view');

    const itemPrototype = document.getElementById('candidatura-item-prototype');
    const detalhePrototype = document.getElementById('candidatura-detalhe-prototype');
    const confirmacaoPrototype = document.getElementById('candidatura-confirmacao-prototype');
    const resultadoPrototype = document.getElementById('candidatura-resultado-prototype');

    let candidaturasData = [];
    let selectedCandidaturaId = null;

    function switchView(viewName) {
        [listaView, detalheView, confirmacaoView, resultadoView].forEach(v => v.style.display = 'none');
        const modalContent = modal.querySelector('.modal-content');
        
        if (viewName === 'lista'){
            listaView.style.display = 'block';
            modalContent.classList.remove('modo-detalhe');
        } 
        if (viewName === 'detalhes') {
            detalheView.style.display = 'block';
            modalContent.classList.add('modo-detalhe');
        }
        if (viewName === 'confirmacao'){
            confirmacaoView.style.display = 'block';
            modalContent.classList.add('modo-detalhe');
        }

        if (viewName === 'resultado'){
            resultadoView.style.display = 'block';
            modalContent.classList.add('modo-detalhe');
        }
    }

    function renderListView() {
        while (candidaturasList.children.length > 1) {
            candidaturasList.removeChild(candidaturasList.lastChild);
        }
        modalFooter.style.display = 'none';
        selectedCandidaturaId = null;

        if (candidaturasData.length === 0) {
            candidaturasList.innerHTML += `<p class="no-candidaturas-message">Você ainda não possui candidaturas ativas.</p>`;
        } else {
            candidaturasData.forEach(candidatura => {
                const clone = itemPrototype.cloneNode(true);
                clone.removeAttribute('id');
                clone.style.display = '';
                clone.dataset.id = candidatura._id;
                clone.querySelector('.vaga-nome').textContent = candidatura.vaga.nome;
                clone.querySelector('.empresa-nome').textContent = candidatura.empresa.nome;
                clone.querySelector('.status').textContent = candidatura.status;
                clone.querySelector('.data-candidatura').textContent = new Date(candidatura.createdAt).toLocaleDateString('pt-BR');
                candidaturasList.appendChild(clone);
            });
        }
        modalTitle.innerText = 'Minhas Candidaturas';
        switchView('lista');
    }

    function renderDetailView() {
        const candidatura = candidaturasData.find(c => c._id === selectedCandidaturaId);
        if (!candidatura) return;

        detalheView.innerHTML = '';
        const clone = detalhePrototype.cloneNode(true);
        clone.removeAttribute('id');
        clone.querySelector('.vaga-nome').textContent = candidatura.vaga.nome || 'N/A';
        clone.querySelector('.empresa-nome').textContent = candidatura.empresa.nome || 'N/A';
        clone.querySelector('.status').textContent = candidatura.status;
        clone.querySelector('.vaga-area').textContent = candidatura.vaga.area || 'N/A';
        clone.querySelector('.vaga-requisitos').textContent = candidatura.vaga.requisitos || 'N/A';
        clone.querySelector('.data-candidatura').textContent = new Date(candidatura.createdAt).toLocaleDateString('pt-BR');
        clone.querySelector('.btn-cancelar').dataset.id = candidatura._id;
        detalheView.appendChild(clone);
        
        modalTitle.innerText = 'Detalhes da Candidatura';
        switchView('detalhes');
        modalFooter.style.display = 'none';
    }

    function renderConfirmacaoView(candidaturaId) {
        const candidatura = candidaturasData.find(c => c._id === candidaturaId);
        if (!candidatura) return;

        confirmacaoView.innerHTML = '';
        const clone = confirmacaoPrototype.cloneNode(true);
        clone.removeAttribute('id');
        clone.querySelector('.vaga-nome').textContent = candidatura.vaga.nome;
        clone.querySelector('.empresa-nome').textContent = candidatura.empresa.nome;
        clone.querySelector('.status').textContent = candidatura.status;
        clone.querySelector('.btn-confirmar-cancelamento').dataset.id = candidatura._id;
        
        confirmacaoView.appendChild(clone);
        modalTitle.innerText = 'Confirmar Ação';
        switchView('confirmacao');
    }

    function renderResultadoView(mensagem) {
        resultadoView.innerHTML = '';
        const clone = resultadoPrototype.cloneNode(true);
        clone.removeAttribute('id');
        clone.querySelector('.resultado-mensagem').textContent = mensagem;

        resultadoView.appendChild(clone);
        modalTitle.innerText = 'Resultado';
        switchView('resultado');
    }
    
    async function executarCancelamento(candidaturaId) {
        const candidatoId = document.body.dataset.candidatoId;
        try {
            const response = await fetch(`/candidato/${candidatoId}/vagas/delete/${candidaturaId}`, { method: 'POST' });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Falha ao cancelar a candidatura.');
            }
            renderResultadoView('Candidatura cancelada com sucesso!');
        } catch (error) {
            console.error('Erro ao cancelar:', error);
            renderResultadoView(`Ocorreu um erro: ${error.message}`);
        }
    }

    async function openModal() {
        try {
            const response = await fetch('/candidato/candidaturas');
            if (!response.ok) throw new Error('Falha ao buscar candidaturas');
            candidaturasData = await response.json();
            renderListView();
            modal.style.display = 'flex';
        } catch (error) {
            console.error('Erro:', error);
            candidaturasList.innerHTML = `<p class="no-candidaturas-message">Erro ao carregar candidaturas.</p>`;
            switchView('lista');
            modal.style.display = 'flex';
        }
    }

    openModalBtn.addEventListener('click', openModal);
    closeButton.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target === modal) modal.style.display = 'none';
    });

    candidaturasList.addEventListener('click', (e) => {
        const item = e.target.closest('.candidatura-item');
        if (!item || !item.dataset.id) return;
        candidaturasList.querySelectorAll('.candidatura-item.selected').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        selectedCandidaturaId = item.dataset.id;
        modalFooter.style.display = 'flex';
    });

    visualizarBtn.addEventListener('click', () => {
        if (selectedCandidaturaId) {
            renderDetailView();
        }
    });

    detalheView.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-voltar')) {
            renderListView();
        }
        if (e.target.classList.contains('btn-cancelar')) {
            const id = e.target.dataset.id;
            renderConfirmacaoView(id);
        }
    });

    confirmacaoView.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-voltar-detalhes')) {
            renderDetailView();
        }
        if (e.target.classList.contains('btn-confirmar-cancelamento')) {
            const id = e.target.dataset.id;
            executarCancelamento(id);
        }
    });

    resultadoView.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-ok')) {
            openModal();
        }
    });
});