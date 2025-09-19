const express = require('express')
const connectDb = require('./db')
const empresaRoutes = require('./src/routes/empresaRoutes');
const candidatoRoutes = require('./src/routes/candidatoRoutes');
const geral = require('./src/routes/geralRoutes')
const hbs = require('handlebars');
const path = require('path')
const {
    engine
} = require('express-handlebars')

// Registra o helper ifCond
hbs.registerHelper('ifCond', function (v1, v2, options) {
    return v1 === v2 ? options.fn(this) : options.inverse(this);
});

// Configuração da autenticação de senha
require('dotenv').config()
const session = require('express-session');
const MongoStore = require('connect-mongo');


// Configuração do Express
const app = express()
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

try {
    app.use(session({
        secret: process.env.SESSION_SECRET || 'fallback-key',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        }),
        cookie: {
            maxAge: 1000 * 60 * 60, // 1 hora
            secure: process.env.NODE_ENV === 'production', // Apenas true em produção
            httpOnly: true
        }
    }));
} catch (erro) {
    console.error(erro);
    res.status(500).json({
        message: 'Erro ao configurar a seessão do usuário!',
        error: erro.messgae
    });
}

// Configuração das rotas
app.use('/empresa', empresaRoutes);
app.use('/candidato', candidatoRoutes);
app.use(geral);

// Caminho de arquivos estáticos
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
app.use('/img', express.static(path.join(__dirname, 'src/img')));

// Configuração do Handlebars
app.set('views', path.join(__dirname, 'src/views'))
app.engine('.hbs', engine({
    extname: "hbs", //index.hbs
    layoutDir: path.join(__dirname, 'src/views/layouts'),
    defaultLayout: 'main.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}))
app.set('view engine', '.hbs')

// Conexão com o banco e com o servidor
connectDb()
    .then(data => {
        console.log(' >> Banco de dados conectado com sucesso:\n')
        app.listen(3000, () => {
            console.log(`>> Servidor rodando na porta http://localhost:${3000}/home\n`)
        }).on('error', err =>
            console.log('Erro ao ligar o servidor:\n', err))
    })
    .catch(err => console.log('Nao foi possivel conectar ao Banco de Dados:\n', err))