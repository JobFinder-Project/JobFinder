document.addEventListener('DOMContentLoaded', () => {

    const TOTAL_STEPS = 4;
    const progressSteps = document.querySelectorAll('.progress-step');

    const inputs = {
        nome: document.getElementById("nome"),
        cnpj: document.getElementById("cnpj"),
        fone: document.getElementById("fone"),
        email: document.getElementById("email"),
        senha: document.getElementById("senha")
    };

    const errors = {
        nome: document.getElementById("nomeError"),
        cnpj: document.getElementById("cnpjError"),
        fone: document.getElementById("foneError"),
        email: document.getElementById("emailError"),
        senha: document.getElementById("senhaError")
    };
    
    // Função de validação de Email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Função de Validação Matemática de CNPJ
    function validateCNPJ(cnpj) {
        cnpj = cnpj.replace(/\D/g, ''); // Remove caracteres não numéricos

        // Verifica se o CNPJ tem 14 dígitos
        if (cnpj.length !== 14) return false;

        // Elimina CNPJs com todos os dígitos iguais
        if (/^(\d)\1{13}$/.test(cnpj)) return false;

        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        const digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        let resultado;

        // Cálculo do primeiro dígito verificador
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(0))) return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        // Cálculo do segundo dígito verificador
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(1))) return false;

        return true;
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

    function clearStepErrors(stepNumber) {
        const currentStep = document.getElementById(`step${stepNumber}`);
        if (!currentStep) return;

        currentStep.querySelectorAll('.form-input').forEach(input => {
            input.classList.remove('is-invalid');
        });
        currentStep.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('active');
            error.textContent = '';
        });
    }

    // Função mantida, mas a validação principal é feita com validateCNPJ
    function validateCnpjFormat(value) {
        const cleanedValue = value.replace(/\D/g, "");
        return cleanedValue.length === 14; 
    }

    function validateFoneFormat(value) {
        const cleanedValue = value.replace(/\D/g, "");
        return cleanedValue.length === 10 || cleanedValue.length === 11;
    }
    
    function validateStep(stepNumber) {
        if (stepNumber > TOTAL_STEPS) return null; 
        clearStepErrors(stepNumber);

        const currentStep = document.getElementById(`step${stepNumber}`);
        if (!currentStep) return null;

        const requiredInputs = currentStep.querySelectorAll('input[required]');

        for (const input of requiredInputs) {
            let errorMessage = null;

            // VALIDAÇÃO COMPLETA DE CNPJ
            if (input.id === 'cnpj' && input.value.trim()) {
                if (!validateCNPJ(input.value)) {
                    errorMessage = "CNPJ inválido. Verifique os números digitados.";
                }
            } 
            
            else if (input.id === 'fone' && !validateFoneFormat(input.value)) {
                errorMessage = "Telefone deve ter 10 ou 11 dígitos.";
            } 
            
            // VALIDAÇÃO DE EMAIL
            else if (input.id === 'email' && input.value.trim() && !validateEmail(input.value)) {
                errorMessage = "Por favor, digite um endereço de e-mail válido.";
            }
            
            else if (!input.checkValidity()) {
                if (input.validity.valueMissing) {
                    errorMessage = "Este campo é obrigatório.";
                } else if (input.validity.typeMismatch) {
                    errorMessage = "Por favor, digite um formato válido (ex: email).";
                } else if (input.validity.tooShort) {
                    errorMessage = `A senha deve ter pelo menos ${input.minLength} caracteres.`;
                } else {
                    errorMessage = "Preencha este campo corretamente.";
                }
            }
            
            if (errorMessage) {
                const errorElement = errors[input.id];
                showValidationError(input, errorElement, errorMessage);
                return input; 
            }
        }
        
        return null;
    }

    function updateProgressSteps(currentStep) {
        progressSteps.forEach(stepElement => {
            const stepNumber = parseInt(stepElement.getAttribute('data-step'));
            stepElement.classList.remove('active', 'completed');
            if (stepNumber < currentStep) {
                stepElement.classList.add('completed');
            } else if (stepNumber === currentStep) {
                stepElement.classList.add('active');
            }
        });
    }

    window.nextStep = function(nextStepNumber) {
        const currentStepNumber = nextStepNumber - 1; 
        
        if (currentStepNumber === TOTAL_STEPS) {
            validateStep(currentStepNumber);
            return; 
        }

        const invalidInput = validateStep(currentStepNumber);
        
        if (invalidInput) {
            invalidInput.focus();
        } else {
            clearStepErrors(currentStepNumber); 
            document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
            const nextModal = document.getElementById(`step${nextStepNumber}`);
            if(nextModal) {
                 nextModal.classList.add("active");
            }
            updateProgressSteps(nextStepNumber);
        }
    }

    window.prevStep = function(prevStepNumber) {
        document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
        document.getElementById(`step${prevStepNumber}`).classList.add("active");
        updateProgressSteps(prevStepNumber);
    }
    
    function setupRealTimeValidation(inputId) {
        const inputElement = inputs[inputId];
        if (inputElement) {
             inputElement.addEventListener("input", () => {
                const parentModal = inputElement.closest('.modal');
                if (parentModal && parentModal.classList.contains('active')) {
                    const stepNumber = parseInt(parentModal.id.replace('step', ''));
                    validateStep(stepNumber); 
                }
            });
        }
    }

    setupRealTimeValidation('nome');
    setupRealTimeValidation('email');
    setupRealTimeValidation('senha');
    setupRealTimeValidation('cnpj'); // Validação em tempo real para CNPJ


    if (inputs.cnpj) {
        inputs.cnpj.addEventListener("input", (e) => {
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
            
            validateStep(1); 
        });
    }

    if (inputs.fone) {
        inputs.fone.addEventListener("input", (e) => {
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
            
            validateStep(2); 
        });
    }
    
    const companyForm = document.getElementById('companyForm');
    if (companyForm && inputs.cnpj && inputs.fone) {
        companyForm.addEventListener('submit', (e) => {
            
            const invalidInput = validateStep(TOTAL_STEPS);
            if (invalidInput) {
                e.preventDefault();
                invalidInput.focus();
                return;
            }
            
            inputs.cnpj.value = inputs.cnpj.value.replace(/\D/g, "");
            inputs.fone.value = inputs.fone.value.replace(/\D/g, "");
            
        });
    }

    updateProgressSteps(1); 
});