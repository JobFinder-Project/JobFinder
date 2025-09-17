// Controle de modais
function nextStep(step) {
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
  document.getElementById(`step${step}`).classList.add("active");
}

function prevStep(step) {
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
  document.getElementById(`step${step}`).classList.add("active");
}

// Máscara de CNPJ
const cnpjInput = document.getElementById("cnpj");
if (cnpjInput) {
  cnpjInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
    e.target.value = v;
  });
}

// Máscara de Telefone
const foneInput = document.getElementById("fone");
if (foneInput) {
  foneInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    e.target.value = v;
  });
}

// Validações simples antes de avançar etapas
document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", (e) => {
    if (!form.checkValidity()) {
      e.preventDefault();
      alert("Preencha os campos obrigatórios corretamente!");
    }
  });
});
