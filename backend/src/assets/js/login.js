document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtém os valores do email e senha do formulário
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Envia as credenciais para o backend via fetch
    fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                senha
            })
        })
        .then(response => response.json())
        .then(data => {
            // Se o token for recebido, armazena no localStorage
            if (data.token) { 
                localStorage.setItem('token', data.token);
                window.location.href = '/inicial';
            } else {
                alert('Login falhou. Verifique suas credenciais.');
            }
        })
        // Trata erros de requisição
        .catch(err => {
            console.error('Erro no login:', err);
            alert('Erro ao realizar o login. Tente novamente.');
        });
});