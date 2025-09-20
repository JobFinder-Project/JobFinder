// Verifica se o usuário está autenticado
exports.isAuthenticated = (req, res, next) => {
    try {
        //console.log("req.session em isAuthenticated:", req.session) //print no teminal dos dados de sessao
        if (req.session && req.session.user) {
            return next();
        }
        res.redirect('/login');
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: "Erro ao verificar a autenticação!",
            error: erro.message
        });
    }
};

// Verifica se a sessão do usuário é de Candidato
exports.isCandidato = (req, res, next) => {
    try {
        if (req.session.user && req.session.user.role === 'candidato') {
            return next();
        }
        res.status(403).send('Acesso negado');
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: "Erro ao verificar a autentificação do candidato!",
            error: erro.message
        });
    }
};

// Verifica se a sessão do usuário é de Empresa
exports.isEmpresa = (req, res, next) => {
    try {
        if (req.session.user && req.session.user.role === 'empresa') {
            return next();
        }
        res.status(403).send('Acesso negado');
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: "Erro ao verificar a autenticação do empregador!",
            error: erro.message
        });
    }
};

// Verifica se a sessão do usuário é de Candidato
exports.isCandidato = (req, res, next) => {
    try {
        if (req.session.user && req.session.user.role === 'candidato') {
            return next();
        }
        res.status(403).send('Acesso negado');
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: "Erro ao verificar a autentificação do candidato!",
            error: erro.message
        });
    }
};

// Verifica se a sessão do usuário é de Empresa
exports.isEmpresa = (req, res, next) => {
    try {
        if (req.session.user && req.session.user.role === 'empresa') {
            return next();
        }
        res.status(403).send('Acesso negado');
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: "Erro ao verificar a autentificação do candidato!",
            error: erro.message
        });
    }
};