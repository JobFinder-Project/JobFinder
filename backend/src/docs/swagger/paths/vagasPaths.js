import { areasEnum } from '../constants.js';

export const vagasPaths = {
  '/vagas': {
    get: {
      tags: ['Vagas'],
      summary: 'Buscar vagas',
      security: [{ sessionAuth: [] }],
      parameters: [
        { in: 'query', name: 'q', schema: { type: 'string' } },
        { in: 'query', name: 'area', schema: { type: 'string', enum: areasEnum } },
      ],
      responses: {
        200: {
          description: 'Lista de vagas com dados públicos da empresa',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VagasResponse' },
            },
          },
        },
        401: { description: 'Não autenticado' },
      },
    },
  },

  '/areas': {
    get: {
      tags: ['Vagas'],
      summary: 'Listar áreas disponíveis',
      security: [{ sessionAuth: [] }],
      responses: {
        200: { description: 'Lista de áreas' },
        401: { description: 'Não autenticado' },
      },
    },
  },
};
