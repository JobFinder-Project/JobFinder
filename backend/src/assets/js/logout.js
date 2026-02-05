const logoutBtn = document.getElementById("logout");

// Verifica se o botão de logout existe
if (logoutBtn) {
    try {
      // Remove o token de sessão
        logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ message: 'Erro ao realizar o logout!', error: erro.messgae });
    }
  
}
