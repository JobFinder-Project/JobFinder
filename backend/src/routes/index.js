import express from 'express';
import authRoutes from './authRoutes.js';
import vagasRoutes from './vagasRoutes.js';
import candidatoRoutes from './candidatoRoutes.js';
import empresaRoutes from './empresaRoutes.js';
import { globalError, notFound } from '../middlewares/errorHandler.js';

const routes = (app, basePath = '') => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(`${basePath}/`, authRoutes);
  app.use(`${basePath}/candidato`, candidatoRoutes);
  app.use(`${basePath}/empresa`, empresaRoutes);
  app.use(`${basePath}/`, vagasRoutes);

  // O fallback para rotas não encontradas agora escuta na raiz do basePath
  app.use(`${basePath}/`, notFound);
  app.use(globalError);
};

export default routes;