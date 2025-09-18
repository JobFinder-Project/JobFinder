function abrirModalCandidatura() {
  document.getElementById("candidaturaModal").classList.add("show");
  document.querySelector(".modal-backdrop").classList.add("show");
}
function fecharModalCandidatura() {
  document.getElementById("candidaturaModal").classList.remove("show");
  document.querySelector(".modal-backdrop").classList.remove("show");
}

function abrirModalDetalhes(id, nome, area, requisitos, empresa, imagem) {
  const modal = document.getElementById("detalhesModal");
  const conteudo = document.getElementById("detalhesConteudo");

  conteudo.innerHTML = `
    <form action="/candidato/${id}/vagas/${id}" method="POST">
      <div class="vaga-detalhes1">
        ${imagem && imagem !== "undefined" ? `<img src="${imagem}" alt="${nome}" class="vaga-imagem" />` : ""}
        <h2>${nome}</h2>
        <p><strong>Área:</strong> ${area}</p>
        <p><strong>Requisitos:</strong> ${requisitos}</p>
        <p><strong>Empresa:</strong> ${empresa}</p>
      </div>
      <button type="submit" class="register-button1">Candidatar-se</button>
    </form>
  `;

  modal.classList.add("show");
}

function fecharModalDetalhes() {
  document.getElementById("detalhesModal").classList.remove("show");
  document.querySelector(".modal-backdrop").classList.remove("show");
}

//Fecha ao clicar fora
window.onclick = function (event) {
  let modal1 = document.getElementById("detalhesModal");
  let modal2 = document.getElementById("candidaturaModal");
  if (event.target === modal1) modal1.style.display = "none";
  if (event.target === modal2) modal2.style.display = "none";
}

// Verifica se a URL contém o parâmetro "success"
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('success') === 'true') {
  Swal.fire({
    icon: 'success',
    title: 'Sucesso!',
    text: 'candidatura realizado com sucesso!',
    confirmButtonText: 'OK',
    timer: 3000 // Fecha automaticamente após 3 segundos
  });
}

