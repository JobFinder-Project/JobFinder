import express from 'express';
import authRoutes from './authRoutes.js';
import vagasRoutes from './vagasRoutes.js';
import candidatoRoutes from './candidatoRoutes.js';
import empresaRoutes from './empresaRoutes.js';
import { globalError, notFound } from '../middlewares/errorHandler.js';

const routes = (app, basePath = '/api') => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/auth', authRoutes);
  app.all(
    [
      `${basePath}/login`,
      `${basePath}/me`,
      `${basePath}/logout`,
      `${basePath}/recuperar_senha`,
      `${basePath}/redefinir_senha/:token`,
      `${basePath}/auth/*`,
    ],
    notFound
  );
  app.use(`${basePath}/candidato`, candidatoRoutes);
  app.use(`${basePath}/empresa`, empresaRoutes);
  app.use(`${basePath}`, vagasRoutes);

  app.use('/auth', notFound);
  app.use(basePath, notFound);
  app.use(globalError);
};

export default routes;
