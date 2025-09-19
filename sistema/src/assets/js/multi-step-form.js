let currentStep = 1;
const totalSteps = 5;
let formData = {}; // PRESERVA OS DADOS ENTRE ETAPAS

// Função para salvar dados da etapa atual
function saveCurrentStepData() {
  const currentModal = document.getElementById(`step${currentStep}`);
  const inputs = currentModal.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    if (input.type === 'file') {
      // Para arquivos, salvamos a referência
      if (input.files.length > 0) {
        formData[input.name] = input.files[0];
      }
    } else {
      formData[input.name] = input.value;
    }
  });
}

// Função para restaurar dados da etapa
function restoreStepData() {
  const currentModal = document.getElementById(`step${currentStep}`);
  const inputs = currentModal.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    if (formData[input.name] && input.type !== 'file') {
      input.value = formData[input.name];
    }
  });
}

// Função para avançar para próxima etapa
function nextStep(stepNumber) {
  // Validar etapa atual antes de avançar
  if (!validateCurrentStep()) {
    return; // Para aqui se houver erro - NÃO PERDE OS DADOS
  }
  
  // Salvar dados da etapa atual
  saveCurrentStepData();
  
  // Ocultar etapa atual
  document.getElementById(`step${currentStep}`).classList.remove('active');
  
  // Mostrar próxima etapa
  currentStep = stepNumber;
  document.getElementById(`step${currentStep}`).classList.add('active');
  
  // Restaurar dados da próxima etapa (se existirem)
  restoreStepData();
  
  // Atualizar indicador de progresso
  updateProgressIndicator();
}

// Função para voltar à etapa anterior
function prevStep(stepNumber) {
  // Salvar dados da etapa atual (mesmo voltando)
  saveCurrentStepData();
  
  // Ocultar etapa atual
  document.getElementById(`step${currentStep}`).classList.remove('active');
  
  // Mostrar etapa anterior
  currentStep = stepNumber;
  document.getElementById(`step${currentStep}`).classList.add('active');
  
  // Restaurar dados da etapa anterior
  restoreStepData();
  
  // Atualizar indicador de progresso
  updateProgressIndicator();
}

// Função para validar etapa atual
function validateCurrentStep() {
  const currentModal = document.getElementById(`step${currentStep}`);
  const requiredInputs = currentModal.querySelectorAll('input[required], select[required]');
  let isValid = true;
  
  // Limpar erros anteriores
  clearErrors(currentModal);
  
  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      showError(input, `${input.previousElementSibling.textContent} é obrigatório`);
      isValid = false;
    } else {
      // Validações específicas
      if (input.id === 'cpf' && !validateCPF(input.value)) {
        showError(input, 'CPF deve ser válido');
        isValid = false;
      } else if (input.id === 'email' && !validateEmail(input.value)) {
        showError(input, 'Email deve ser válido');
        isValid = false;
      } else if (input.id === 'senha' && input.value.length < 8) {
        showError(input, 'Senha deve ter pelo menos 8 caracteres');
        isValid = false;
      } else {
        clearError(input);
      }
    }
  });
  
  return isValid;
}

// Função para mostrar erro
function showError(input, message) {
  input.classList.add('error');
  
  // Criar ou atualizar mensagem de erro
  let errorElement = input.parentNode.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    input.parentNode.appendChild(errorElement);
  }
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

// Função para limpar erro
function clearError(input) {
  input.classList.remove('error');
  const errorElement = input.parentNode.querySelector('.error-message');
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}

// Limpa todos os erros visíveis em um container específico
function clearErrors(container) {
    container.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('error');
    });
    container.querySelectorAll('.error-message').forEach(errorEl => {
        errorEl.style.display = 'none';
    });
}

// Função para atualizar indicador de progresso
function updateProgressIndicator() {
  document.querySelectorAll('.progress-step').forEach((step, index) => {
    step.classList.remove('active', 'completed');
    if (index + 1 === currentStep) {
      step.classList.add('active');
    } else if (index + 1 < currentStep) {
      step.classList.add('completed');
    }
  });
}

// Validação de CPF
function validateCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validação do primeiro dígito
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  // Validação do segundo dígito
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

// Validação de Email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Máscaras de input
function setupMasks() {
  // Máscara para CPF
  const cpfInput = document.getElementById('cpf');
  if (cpfInput) {
    cpfInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      e.target.value = value;
    });
  }

  // Máscara para Telefone
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
      }
      e.target.value = value;
    });
  }
}

// Substituição da função submitForm()
async function submitForm() {
    // Validar etapa atual
    if (!validateCurrentStep()) {
        return;
    }

    // Salvar dados da etapa final
    saveCurrentStepData();

    // Validar todas as etapas antes de enviar
    let allValid = true;
    for (let i = 1; i <= totalSteps; i++) {
        const stepModal = document.getElementById(`step${i}`);
        const requiredInputs = stepModal.querySelectorAll('input[required], select[required]');

        requiredInputs.forEach(input => {
            if (!formData[input.name] || !formData[input.name].toString().trim()) {
                allValid = false;
                // Voltar para a etapa com erro
                if (allValid === false && currentStep !== i) {
                    document.getElementById(`step${currentStep}`).classList.remove('active');
                    currentStep = i;
                    document.getElementById(`step${currentStep}`).classList.add('active');
                    restoreStepData();
                    showError(input, `${input.previousElementSibling.textContent} é obrigatório`);
                }
            }
        });
        
        if (!allValid) break;
    }

    if (allValid) {
        // Obter o formulário e criar um objeto FormData com todos os dados salvos
        const form = document.getElementById('candidateForm');
        const finalFormData = new FormData();
        
        // Adicionar todos os dados do objeto formData (incluindo o arquivo) ao FormData
        for (const key in formData) {
            finalFormData.append(key, formData[key]);
        }

        // Tentar enviar o formulário com fetch
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: finalFormData,
            });

            // Se o cadastro foi um sucesso
            if (response.ok) {
                // Limpa todos os erros anteriores, se existirem
                clearAllErrors();
                
                // Redireciona o usuário para a página home
                window.location.href = '/home';
            } else {
                // Se a resposta for um erro (ex: 422 - e-mail duplicado)
                const errorData = await response.json();
                
                // Limpa erros anteriores
                clearAllErrors();
                
                // Encontra a etapa do erro (assumindo que o erro de email é na etapa 5)
                const errorStep = 5; 
                
                // Mude para a etapa com erro se não estiver nela
                if (currentStep !== errorStep) {
                    document.getElementById(`step${currentStep}`).classList.remove('active');
                    currentStep = errorStep;
                    document.getElementById(`step${currentStep}`).classList.add('active');
                    restoreStepData();
                }

                // Exibe a mensagem de erro específica para o campo de email
                const emailInput = document.getElementById('email');
                showError(emailInput, errorData.mgs);
                
                // Rola para a etapa do erro (opcional, para uma melhor UX)
                document.getElementById('step5').scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
            alert('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
        }
    } else {
        alert('Por favor, verifique todos os campos obrigatórios.');
    }
}

// Nova função para limpar todos os erros visíveis
function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
}

// Inicialização quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  // Configurar máscaras
  setupMasks();
  
  // Configurar evento de submit
  const form = document.getElementById('candidateForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      submitForm();
    });
  }
  
  // Restaurar dados se existirem (útil para quando há erro de servidor)
  restoreStepData();
  
  console.log('Multi-step form inicializado com preservação de dados');
});