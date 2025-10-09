const express = require('express')
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

const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'fallback-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    }
};

if (process.env.NODE_ENV === 'test') {

    app.use(session(sessionConfig));
} else {
    sessionConfig.store = MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    });
    try {
        app.use(session(sessionConfig));
    } catch (erro) {
        console.error('Erro fatal ao configurar a sessão do usuário com MongoStore!', erro);
        process.exit(1);
    }
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

module.exports = app;