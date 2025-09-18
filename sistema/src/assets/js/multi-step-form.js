class MultiStepForm {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.form = document.getElementById("candidateForm");
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupMasks();
    this.updateUI();
  }

  setupEventListeners() {
    document
      .getElementById("nextBtn")
      .addEventListener("click", () => this.nextStep());
    document
      .getElementById("prevBtn")
      .addEventListener("click", () => this.prevStep());
    document.getElementById("submitBtn").addEventListener("click", (e) => {
      e.preventDefault();
      this.submitForm();
    });
  }

  setupMasks() {
    // Máscara para CPF
    const cpfInput = document.getElementById("cpf");
    cpfInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      e.target.value = value;
    });

    // Máscara para Telefone
    const telefoneInput = document.getElementById("telefone");
    telefoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d)/, "($1) $2");
        value = value.replace(/(\d{4,5})(\d{4})$/, "$1-$2");
      }
      e.target.value = value;
    });
  }

  validateStep(step) {
    const stepElement = document.querySelector(
      `.form-step[data-step="${step}"]`
    );
    const requiredInputs = stepElement.querySelectorAll(
      "input[required], select[required]"
    );
    let isValid = true;

    requiredInputs.forEach((input) => {
      const errorElement = document.getElementById(`${input.id}-error`);

      if (!input.value.trim()) {
        this.showError(input, errorElement);
        isValid = false;
      } else {
        // Validações específicas
        if (input.id === "cpf" && !this.validateCPF(input.value)) {
          this.showError(input, errorElement);
          isValid = false;
        } else if (input.id === "email" && !this.validateEmail(input.value)) {
          this.showError(input, errorElement);
          isValid = false;
        } else {
          this.clearError(input, errorElement);
        }
      }
    });

    return isValid;
  }

  validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showError(input, errorElement) {
    input.classList.add("error");
    if (errorElement) errorElement.style.display = "block";
  }

  clearError(input, errorElement) {
    input.classList.remove("error");
    if (errorElement) errorElement.style.display = "none";
  }

  nextStep() {
    if (this.validateStep(this.currentStep)) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.updateUI();
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateUI();
    }
  }

  updateUI() {
    // Atualizar etapas do formulário
    document.querySelectorAll(".form-step").forEach((step, index) => {
      step.classList.remove("active");
      if (index + 1 === this.currentStep) {
        step.classList.add("active");
      }
    });

    // Atualizar indicador de progresso
    document.querySelectorAll(".progress-step").forEach((step, index) => {
      step.classList.remove("active", "completed");
      if (index + 1 === this.currentStep) {
        step.classList.add("active");
      } else if (index + 1 < this.currentStep) {
        step.classList.add("completed");
      }
    });

    // Atualizar botões
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");

    prevBtn.style.display = this.currentStep === 1 ? "none" : "block";

    if (this.currentStep === this.totalSteps) {
      nextBtn.style.display = "none";
      submitBtn.style.display = "block";
    } else {
      nextBtn.style.display = "block";
      submitBtn.style.display = "none";
    }
  }

  submitForm() {
    if (this.validateStep(this.currentStep)) {
      // Validar todo o formulário antes de enviar
      let allValid = true;
      for (let i = 1; i <= this.totalSteps; i++) {
        if (!this.validateStep(i)) {
          allValid = false;
          // Voltar para a primeira etapa com erro
          this.currentStep = i;
          this.updateUI();
          break;
        }
      }

      if (allValid) {
        this.form.submit();
      } else {
        alert("Por favor, verifique todos os campos obrigatórios.");
      }
    }
  }
}

// Inicializar o formulário quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  new MultiStepForm();
});
