const request = require('supertest');
const http = require('http');
const app = require('../app'); 
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const Candidato = require('../src/models/candidatoModel');
const Empregador = require('../src/models/empresaModel');

let mongoServer;
let server;
let agent;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  server = http.createServer(app);
});

beforeEach(() => {
  agent = request.agent(app);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close(); 
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});

// ===================================================================================
// == TESTES PARA O FLUXO DO CANDIDATO
// ===================================================================================
describe('Fluxo de Autenticação do Candidato', () => {
  const mockCandidato = {
    nome: 'Joana da Silva Teste',
    cpf: '123.456.789-00',
    email: 'joana.teste@exemplo.com',
    senha: 'senhaforte123',
    telefone: '(92) 99999-9999',
    educacao: 'Ensino Superior Completo em Análise de Sistemas',
  };

  it('deve CADASTRAR um novo candidato, VERIFICAR no banco, e realizar o LOGIN', async () => {
    // --- CADASTRO ---
    await agent
      .post('/candidato/cadastrar') // Conforme candidatoRoutes.js
      .send(mockCandidato)
      .expect(302); // Espera o redirecionamento para a home

    // --- VERIFICAÇÃO NO BANCO DE DADOS ---
    // Agora usamos o modelo para consultar o banco de teste
    const candidatoNoDb = await Candidato.findOne({ email: mockCandidato.email });

    // Verificamos se o candidato foi realmente criado
    expect(candidatoNoDb).not.toBeNull(); 
    // E se os dados batem com o que enviamos
    expect(candidatoNoDb.nome).toBe(mockCandidato.nome);

    // --- LOGIN ---
    const loginResponse = await agent
      .post('/login') // Conforme geralRoutes.js
      .send({ email: mockCandidato.email, senha: mockCandidato.senha });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.redirectUrl).toBe('/candidato/dashboard');
  });
  
  it('deve permitir acesso ao DASHBOARD do candidato após o login', async () => {
    // Preparação: Cadastra e faz o login
    await agent.post('/candidato/cadastrar').send(mockCandidato);
    await agent.post('/login').send({ email: mockCandidato.email, senha: mockCandidato.senha });

    // Ação: Tenta acessar a rota protegida GET /candidato/dashboard
    const dashboardResponse = await agent.get('/candidato/dashboard');
    
    // Validação: Espera uma resposta de sucesso (página renderizada)
    expect(dashboardResponse.statusCode).toBe(200);
  });

  it('NÃO deve permitir que um CANDIDATO acesse o dashboard da EMPRESA', async () => {
    // Preparação: Cadastra e faz o login como candidato
    await agent.post('/candidato/cadastrar').send(mockCandidato);
    await agent.post('/login').send({ email: mockCandidato.email, senha: mockCandidato.senha });

    // Ação: Tenta acessar a rota protegida do empregador (GET /empresa/dashboard)
    const response = await agent.get('/empresa/dashboard');

    // Validação: A middleware deve retornar o status "Forbidden"
    expect(response.statusCode).toBe(403);
  });

  it('deve realizar o LOGOUT e redirecionar para a página de login', async () => {
    // Preparação: Cadastra e faz o login
    await agent.post('/candidato/cadastrar').send(mockCandidato);
    await agent.post('/login').send({ email: mockCandidato.email, senha: mockCandidato.senha });

    // Ação: Acessa a rota de logout (GET /logout)
    const logoutResponse = await agent.get('/logout');
    
    // Validação: O logoutController redireciona para /login
    expect(logoutResponse.statusCode).toBe(302);
    expect(logoutResponse.headers.location).toBe('/login');

    // Validação Final: Tenta acessar a rota protegida novamente após o logout
    const afterLogoutResponse = await agent.get('/candidato/dashboard');
    expect(afterLogoutResponse.statusCode).toBe(302); // Deve ser redirecionado novamente
  });
});


