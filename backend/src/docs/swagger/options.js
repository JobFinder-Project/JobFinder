import { swaggerInfo, swaggerServers, swaggerTags } from './constants.js';
import { schemas } from './schemas.js';
import { authPaths } from './paths/authPaths.js';
import { candidatoPaths } from './paths/candidatoPaths.js';
import { empresaPaths } from './paths/empresaPaths.js';
import { vagasPaths } from './paths/vagasPaths.js';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: swaggerInfo,
    servers: swaggerServers,
    tags: swaggerTags,
    components: {
      securitySchemes: {
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
        },
      },
      schemas,
    },
    paths: {
      ...authPaths,
      ...candidatoPaths,
      ...empresaPaths,
      ...vagasPaths,
    },
  },
  apis: [],
};
