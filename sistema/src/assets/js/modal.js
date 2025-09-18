// Funções para modal local
function abrirModal(titulo, mensagem) {
  document.getElementById('modal-titulo').textContent = titulo;
  document.getElementById('modal-mensagem').textContent = mensagem;
  document.getElementById('meuModal').style.display = 'flex';
  return new Promise(resolve => {
    const btn = document.querySelector('#meuModal .modal-btn');
    const close = document.querySelector('#meuModal .modal-close');
    function closeHandler() {
      fecharModal();
      btn.removeEventListener('click', closeHandler);
      close.removeEventListener('click', closeHandler);
      resolve();
    }
    btn.addEventListener('click', closeHandler);
    close.addEventListener('click', closeHandler);
  });
}
function fecharModal() {
  document.getElementById('meuModal').style.display = 'none';
}