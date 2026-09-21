import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { mongoMemoryOptions } from './helpers/mongoMemoryOptions.js';

let app;
let client;
let mongoServer;
let sessionStore;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create(mongoMemoryOptions);

  const mongoUrl = mongoServer.getUri();
  client = new MongoClient(mongoUrl);
  await client.connect();

  sessionStore = MongoStore.create({
    mongoUrl,
    collectionName: 'sessions',
    autoRemove: 'disabled',
  });

  app = express();
  app.use(express.json());
  app.use(
    session({
      secret: 'session-test-secret',
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
      },
    })
  );

  app.post('/login', (req, res) => {
    req.session.user = {
      id: 'empresa-test-id',
      role: 'empresa',
    };

    res.status(200).json({ success: true });
  });

  app.get('/me', (req, res) => {
    res.status(200).json({
      authenticated: Boolean(req.session.user),
      user: req.session.user || null,
    });
  });
});

afterAll(async () => {
  await sessionStore?.close();
  await client?.close();
  await mongoServer?.stop();
});

describe('Sessões persistidas no MongoDB', () => {
  it('deve persistir e recuperar sessão usando connect-mongo atualizado', async () => {
    const agent = request.agent(app);

    const loginResponse = await agent.post('/login').send({});
    expect(loginResponse.statusCode).toBe(200);

    const meResponse = await agent.get('/me');
    expect(meResponse.statusCode).toBe(200);
    expect(meResponse.body).toMatchObject({
      authenticated: true,
      user: {
        id: 'empresa-test-id',
        role: 'empresa',
      },
    });

    const savedSessions = await client.db().collection('sessions').find().toArray();
    expect(savedSessions).toHaveLength(1);
    expect(savedSessions[0].session).toContain('empresa-test-id');
  });
});
