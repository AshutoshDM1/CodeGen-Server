import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';

const swaggerRouter = Router();

// Read the OpenAPI YAML file
const swaggerDocument = parse(readFileSync(join(process.cwd(), 'swagger.yaml'), 'utf8'));

// Customize Swagger UI options
const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
    tryItOutEnabled: true,
    displayRequestDuration: true,
    filter: true,
    plugins: [
      () => {
        return {
          statePlugins: {
            spec: {
              wrapSelectors: {
                allowTryItOutFor: () => () => true,
              },
            },
          },
        };
      },
    ],
    requestInterceptor: (req: Record<string, any>) => {
      req.headers['Access-Control-Allow-Origin'] = '*';
      req.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      req.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      return req;
    },
  },
  customCss: '.swagger-ui .topbar { display: none }',
};

// Serve Swagger UI
swaggerRouter.use('/', swaggerUi.serve);
swaggerRouter.get('/', swaggerUi.setup(swaggerDocument, swaggerOptions));

export default swaggerRouter;
