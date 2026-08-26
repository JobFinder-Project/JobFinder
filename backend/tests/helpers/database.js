import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import Candidato from '../../src/models/candidatoModel.js';
import Candidatura from '../../src/models/candidaturaModel.js';
import Empresa from '../../src/models/empresaModel.js';
import Vaga from '../../src/models/vagasModel.js';

export const startTestDatabase = async () => {
  const mongoServer = await MongoMemoryServer.create({
    instance: {
      ip: '127.0.0.1',
    },
  });
  await mongoose.connect(mongoServer.getUri());

  await Promise.all([Candidato.init(), Empresa.init(), Vaga.init(), Candidatura.init()]);

  return mongoServer;
};

export const clearTestDatabase = async () => {
  if (mongoose.connection.readyState !== 1) return;

  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
};

export const stopTestDatabase = async (mongoServer) => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoServer?.stop();
};
