
function verificarSucessoCriacaoVaga() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('vagaCriada') === 'true') {
        document.getElementById('modalSucessoVaga').style.display = 'flex';
        const url = new URL(window.location);
        url.searchParams.delete('vagaCriada');
        url.searchParams.delete('empresaId');
        window.history.replaceState({}, document.title, url.pathname + url.search);
    }
}

let valoresOriginais = {}

function carregarValoresOriginais() {
    valoresOriginais = {
        nome: document.getElementById('editNome').value,
        cnpj: document.getElementById('editCnpj').value,
        email: document.getElementById('editEmail').value,
        fone: document.getElementById('editFone').value,
        bio: document.getElementById('editBio').value,
        site: document.getElementById('editSite').value

    };
}

function resetarFormularioEdicao() {
    if (valoresOriginais) {
        document.getElementById('editNome').value = valoresOriginais.nome || '';
        document.getElementById('editCnpj').value = valoresOriginais.cnpj || '';
        document.getElementById('editEmail').value = valoresOriginais.email || '';
        document.getElementById('editFone').value = valoresOriginais.fone || '';
        document.getElementById('editBio').value = valoresOriginais.bio || '';
        document.getElementById('editSite').value = valoresOriginais.site || '';
    }
    document.querySelectorAll('.error-message').forEach(span => {
        span.textContent = '';
    });
    document.querySelectorAll('input.is-invalid').forEach(input => {
        input.classList.remove('is-invalid');
    });
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');

    if (cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
}


function validateFoneFormat(value) {
    const cleanedValue = value.replace(/\D/g, "");
    return cleanedValue.length === 10 || cleanedValue.length === 11;
}


function showValidationError(inputElement, errorElement, message) {
    if (!inputElement || !errorElement) return;

    if (message) {
        inputElement.classList.add('is-invalid');
        errorElement.textContent = message;
        errorElement.classList.add('active');
    } else {
        inputElement.classList.remove('is-invalid');
        errorElement.classList.remove('active');
        errorElement.textContent = '';
    }
}


function AplicarMascarasEdicao() {
    const cnpjInput = document.getElementById('editCnpj');
    if (cnpjInput) {
        cnpjInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "");
            value = value.substring(0, 14);

            if (value.length > 12) {
                value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
            } else if (value.length > 8) {
                value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,4})/, "$1.$2.$3/$4");
            } else if (value.length > 5) {
                value = value.replace(/^(\d{2})(\d{3})(\d{1,3})/, "$1.$2.$3");
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{1,3})/, "$1.$2");
            }
            e.target.value = value;
            validarCampoCNPJ(e.target);
        });
    }

    const foneInput = document.getElementById('editFone');
    if (foneInput) {
        foneInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "");
            value = value.substring(0, 11);

            if (value.length > 10) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
            } else if (value.length > 6) {
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
            } else {
                value = value.replace(/^(\d*)/, "($1");
            }
            e.target.value = value;
            validarCampoTelefone(e.target);
        });
    }

    const emailInput = document.getElementById('editEmail');
    if (emailInput) {
        emailInput.addEventListener('input', (e) => validarCampoEmail(e.target));
    }
}

function validarCampoCNPJ(input) {
    const errorSpan = document.getElementById('editCnpjError');
    if (!validateCNPJ(input.value)) {
        showValidationError(input, errorSpan, "CNPJ inválido, verifique os números digitados.");
        return false;
    } else {
        showValidationError(input, errorSpan, '');
        return true;
    }
}


function validarCampoEmail(input) {
    const errorSpan = document.getElementById('editEmailError');
    if (input.value.trim() && !validateEmail(input.value)) {
        showValidationError(input, errorSpan, "Por favor, digite um endereço de e-mail válido.");
        return false;
    } else {
        showValidationError(input, errorSpan, '');
        return true;
    }
}

function validarCampoTelefone(input) {
    const errorSpan = document.getElementById('editFoneError');
    if (!validateFoneFormat(input.value)) {
        showValidationError(input, errorSpan, "Telefone deve conter 10 ou 11 dígitos.");
        return false;
    } else {
        showValidationError(input, errorSpan, '');
        return true;
    }
}

function validarFormularioEdicao() {
    const cnpjValido = validarCampoCNPJ(document.getElementById('editCnpj'));
    const emailValido = validarCampoEmail(document.getElementById('editEmail'));
    const telefoneValido = validarCampoTelefone(document.getElementById('editFone'));

    return cnpjValido && emailValido && telefoneValido;
}

document.addEventListener('DOMContentLoaded', () => {
    verificarSucessoCriacaoVaga();

    const openVagasModalBtn = document.getElementById('openVagasModal');
    const vagasModal = document.getElementById('vagasModal');
    const closeVagasModalBtn = document.getElementById('closeVagasModal');

    if (openVagasModalBtn) openVagasModalBtn.onclick = () => { vagasModal.style.display = 'flex'; };
    if (closeVagasModalBtn) closeVagasModalBtn.onclick = () => { vagasModal.style.display = 'none'; };

    const openCriarVagaModalBtn = document.getElementById('openCriarVagaModal');
    const criarVagaModal = document.getElementById('criarVagaModal');
    const closeCriarVagaModalBtn = document.getElementById('closeCriarVagaModal');

    if (openCriarVagaModalBtn) openCriarVagaModalBtn.onclick = () => { criarVagaModal.style.display = 'flex'; };
    if (closeCriarVagaModalBtn) closeCriarVagaModalBtn.onclick = () => { criarVagaModal.style.display = 'none'; };

    const openPerfilModalBtn = document.getElementById('openPerfilModal');
    const perfilModal = document.getElementById('perfilModal');
    const closePerfilModalBtn = document.getElementById('closePerfilModal');
    const closePerfilModalBtn2 = document.getElementById('closePerfilModalBtn');

    if (openPerfilModalBtn) openPerfilModalBtn.onclick = () => { perfilModal.style.display = 'flex'; };
    if (closePerfilModalBtn) closePerfilModalBtn.onclick = () => { perfilModal.style.display = 'none'; };
    if (closePerfilModalBtn2) closePerfilModalBtn2.onclick = () => { perfilModal.style.display = 'none'; };

    const editarPerfilBtn = document.getElementById('editarPerfilBtn');
    const editarPerfilModal = document.getElementById('editarPerfilModal');
    const closeEditarPerfilModalBtn = document.getElementById('closeEditarPerfilModal');
    const voltarVisualizarBtn = document.getElementById('voltarVisualizarBtn');

    if (editarPerfilBtn) {
        editarPerfilBtn.onclick = function () {
            perfilModal.style.display = 'none';
            editarPerfilModal.style.display = 'flex';
            carregarValoresOriginais();

            setTimeout(AplicarMascarasEdicao, 10);
        };
    }

    if (closeEditarPerfilModalBtn) {
        closeEditarPerfilModalBtn.onclick = function () {
            editarPerfilModal.style.display = 'none';
            resetarFormularioEdicao();
        };
    }

    if (voltarVisualizarBtn) {
        voltarVisualizarBtn.onclick = function () {
            editarPerfilModal.style.display = 'none';
            perfilModal.style.display = 'flex';
            resetarFormularioEdicao();
        };
    }

    const closeModalSucesso = document.getElementById('closeModalSucesso');
    const btnOkSucesso = document.getElementById('btnOkSucesso');
    const modalSucessoVaga = document.getElementById('modalSucessoVaga');

    if (closeModalSucesso) closeModalSucesso.onclick = () => { modalSucessoVaga.style.display = 'none'; };
    if (btnOkSucesso) btnOkSucesso.onclick = () => { modalSucessoVaga.style.display = 'none'; };

    const closeDetalhesVagaModalBtn = document.getElementById('closeDetalhesVagaModal');
    if (closeDetalhesVagaModalBtn) closeDetalhesVagaModalBtn.onclick = function () {
        document.getElementById('detalhesVagaModal').style.display = 'none';
    };

    document.querySelectorAll('.view-job-button').forEach(btn => {
        btn.onclick = function (e) {
            e.preventDefault();
            const vaga = {
                nome: btn.getAttribute('data-nome'),
                area: btn.getAttribute('data-area'),
                requisitos: btn.getAttribute('data-requisitos'),
                empresa: btn.getAttribute('data-empresa'),
                imagem: btn.getAttribute('data-imagem')
            };
            abrirDetalhesVaga(vaga);
        };
    });

    window.onclick = function (event) {
        const modals = document.querySelectorAll('.modal, .modal-sucesso');
        modals.forEach(modal => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    }
});

function abrirDetalhesVaga(vaga) {
    document.getElementById('detalhesVagaTitulo').innerText = vaga.nome || 'Detalhes da Vaga';
    document.getElementById('detalhesVagaBody').innerHTML = `
                ${vaga.imagem ? `<img src="${vaga.imagem}" alt="${vaga.nome}" style="max-width:200px;margin-bottom:16px;">` : ''}
                <p><strong>Área:</strong> ${vaga.area || ''}</p> 
                <p><strong>Requisitos:</strong> ${vaga.requisitos || ''}</p> 
                <p><strong>Empresa:</strong> ${vaga.empresa || ''}</p> 
            `;
    document.getElementById('detalhesVagaModal').style.display = 'flex';
}

document.getElementById('formEditarPerfil').onsubmit = async function (e) {
    e.preventDefault();

    if (!validarFormularioEdicao()) {
        alert("Por favor, corrija os erros destacados antes de salvar.");
        return;
    }

    const form = e.target;
    const data = {
        nome: form.editNome.value,
        cnpj: form.editCnpj.value.replace(/\D/g, ''),
        email: form.editEmail.value,
        fone: form.editFone.value.replace(/\D/g, ''),
        bio: form.editBio.value,
        site: form.editSite.value
    };

    try {
        const res = await fetch(form.action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            const result = await res.json();

            document.getElementById('visualNome').textContent = result.empresa.nome;
            document.getElementById('visualCnpj').textContent = form.editCnpj.value; 
            document.getElementById('visualEmail').textContent = result.empresa.email;
            document.getElementById('visualFone').textContent = form.editFone.value; 
            document.getElementById('visualBio').textContent = result.empresa.bio;
            document.getElementById('visualSite').textContent = result.empresa.site;

            document.getElementById('editarPerfilModal').style.display = 'none';
            document.getElementById('perfilModal').style.display = 'flex';

            alert('Perfil atualizado com sucesso!');
        } else {
            const error = await res.json();
            alert('Erro ao salvar alterações: ' + (error.error || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao conectar com o servidor.');
    }
};