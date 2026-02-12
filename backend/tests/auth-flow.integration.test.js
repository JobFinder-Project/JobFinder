import request from 'supertest';
import http from 'http';
import app from '../app'; 
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import Candidato from '../src/models/candidatoModel';
import Empregador from '../src/models/empresaModel';

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
      .post('/api/candidato/cadastrar') 
      .send(mockCandidato)
      .expect(200); // API retorna 200 com JSON de sucesso

    // --- VERIFICAÇÃO NO BANCO DE DADOS ---
    // Agora usamos o modelo para consultar o banco de teste
    const candidatoNoDb = await Candidato.findOne({ email: mockCandidato.email });

    // Verificamos se o candidato foi realmente criado
    expect(candidatoNoDb).not.toBeNull(); 
    // E se os dados batem com o que enviamos
    expect(candidatoNoDb.nome).toBe(mockCandidato.nome);

    // --- LOGIN ---
    const loginResponse = await agent
      .post('/api/login') 
      .send({ email: mockCandidato.email, senha: mockCandidato.senha });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.redirectUrl).toBe('/candidato/dashboard');
  });
  
  it('deve permitir acesso ao DASHBOARD do candidato após o login', async () => {
    // Preparação: Cadastra e faz o login
    await agent.post('/api/candidato/cadastrar').send(mockCandidato);
    await agent.post('/api/login').send({ email: mockCandidato.email, senha: mockCandidato.senha });

    // Ação: Tenta acessar a rota protegida da API
    const dashboardResponse = await agent.get('/api/candidato/dashboard');
    
    // Validação: Espera uma resposta de sucesso com JSON
    expect(dashboardResponse.statusCode).toBe(200);
    expect(dashboardResponse.body).toHaveProperty('candidatoId');
  });

  it('NÃO deve permitir que um CANDIDATO acesse o dashboard da EMPRESA', async () => {
    // Preparação: Cadastra e faz o login como candidato
    await agent.post('/api/candidato/cadastrar').send(mockCandidato);
    await agent.post('/api/login').send({ email: mockCandidato.email, senha: mockCandidato.senha });
  });

  it('deve realizar o LOGOUT corretamente', async () => {
    // Preparação: Cadastra e faz o login
    await agent.post('/api/candidato/cadastrar').send(mockCandidato);
    await agent.post('/api/login').send({ email: mockCandidato.email, senha: mockCandidato.senha });

    // Ação: Acessa a rota de logout (GET /api/logout)
    const logoutResponse = await agent.get('/api/logout');
    
    // Validação: O logout retorna 200 OK
    expect(logoutResponse.statusCode).toBe(200);

    // Validação Final: Tenta acessar a rota protegida novamente após o logout
    const afterLogoutResponse = await agent.get('/api/candidato/dashboard');
    expect(afterLogoutResponse.statusCode).toBe(401); // Deve ser negado
  });
});


// ===================================================================================
// == TESTES PARA O FLUXO DA EMPRESA
// ===================================================================================
describe('Fluxo de Autenticação da Empresa', () => {

  // Dados de teste que respeitam as validações do seu empresaModel.js
  const mockEmpresa = {
    nome: 'Empresa de Teste LTDA',
    cnpj: '12345678000199', // 14 dígitos, sem formatação
    email: 'contato@empresa.com',
    senha: 'senhaempresaforte',
    fone: '9233334444', // 10 ou 11 dígitos
  };

  it('deve CADASTRAR uma nova empresa e retornar sucesso', async () => {
    // A rota de cadastro é POST /api/empresa/cadastrar
    const response = await agent
      .post('/api/empresa/cadastrar')
      .send(mockEmpresa);

    // O controller retorna JSON 200 OK com success: true
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('deve realizar o LOGIN com uma empresa existente e retornar a URL do dashboard', async () => {
    // Preparação
    await agent.post('/api/empresa/cadastrar').send(mockEmpresa);
    
    // Ação
    const loginResponse = await agent
      .post('/api/login')
      .send({ email: mockEmpresa.email, senha: mockEmpresa.senha });
      
    // Validação
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.redirectUrl).toBe('/empresa/dashboard');
  });
});