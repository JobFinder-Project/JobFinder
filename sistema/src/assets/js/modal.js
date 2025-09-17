function abrirModalCandidatura() {
  document.getElementById("candidaturaModal").classList.add("show");
  document.querySelector(".modal-backdrop").classList.add("show");
}

function fecharModalCandidatura() {
  document.getElementById("candidaturaModal").classList.remove("show");
  document.querySelector(".modal-backdrop").classList.remove("show");
}

// Fecha se clicar fora
document.querySelector(".modal-backdrop").addEventListener("click", fecharModalCandidatura);

window.addEventListener("click", function (event) {
  if (event.target === document.getElementById("candidaturaModal")) {
    fecharModalCandidatura();
  }
});


// Modal detalhes
    function abrirModalDetalhes() {
        document.getElementById("detalhesModal").style.display = "block";
    }

    function fecharModalDetalhes() {
        document.getElementById("detalhesModal").style.display = "none";
    }

    // Fecha se clicar fora
    window.onclick = function (event) {
        let modal = document.getElementById("detalhesModal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }