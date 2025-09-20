document.addEventListener('DOMContentLoaded', () => {

  function validateStep(stepNumber) {
    const currentStep = document.getElementById(`step${stepNumber}`);
    const inputs = currentStep.querySelectorAll('input[required]');
    
    for (const input of inputs) {
      if (!input.checkValidity()) {
        return input; 
      }
    }
    
    return null; 
  }

  window.nextStep = function(step) {
    const currentStepNumber = step - 1;
    const invalidInput = validateStep(currentStepNumber);
    console.log("botão acionado")
    
    if (invalidInput) {
      alert(`Por favor, preencha o campo "${invalidInput.labels[0].innerText.replace('*', '')}" corretamente.`);
      invalidInput.focus();
    } else {
      document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
      document.getElementById(`step${step}`).classList.add("active");
    }
  }

  window.prevStep = function(step) {
    document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
    document.getElementById(`step${step}`).classList.add("active");
  }


  const cnpjInput = document.getElementById("cnpj");
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
    });
  }

  const foneInput = document.getElementById("fone");
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
    });
  }

});