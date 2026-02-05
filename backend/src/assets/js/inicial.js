const token = localStorage.getItem('token');

// Verifica se o token expirou para realizar novamente o login
if (!token) {
    console.error('Token não encontrado. Faça login novamente.');
    alert('Você precisa fazer login para acessar esta página.');
    window.location.href = '/login';
}

// Controla e previne o acesso de diferentes perfis
fetch('/inicial', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Acesso negado');
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados recebidos:', data);
    })
    .catch(err => {
        console.error('Erro ao acessar a página inicial:', err);
        alert('Erro de autenticação. Por favor, faça login novamente.');
        window.location.href = '/login';
    });