import express from 'express';
import authRoutes from './authRoutes.js';
import vagasRoutes from './vagasRoutes.js';
import candidatoRoutes from './candidatoRoutes.js';
import empresaRoutes from './empresaRoutes.js';

const routes = (app, basePath = '/api') => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(`${basePath}`, authRoutes);
  app.use(`${basePath}`, vagasRoutes);
  app.use(`${basePath}/candidato`, candidatoRoutes);
  app.use(`${basePath}/empresa`, empresaRoutes);
};

export default routes;
