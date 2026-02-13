import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'fallback-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
  },
};

if (process.env.NODE_ENV === 'test') {
  app.use(session(sessionConfig));
} else {
  if (!process.env.MONGO_URI) {
    console.error('ERRO: A variável MONGO_URI não está definida no .env');
    process.exit(1);
  }

  sessionConfig.store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
  });

  try {
    app.use(session(sessionConfig));
  } catch (erro) {
    console.error('Erro fatal ao configurar a sessão do usuário com MongoStore!', erro);
    process.exit(1);
  }
}

// Configuração das rotas
routes(app, '/api');

export default app;
