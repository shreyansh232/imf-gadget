import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IMF Gadget API',
      version: '1.0.0',
      description: 'API for managing IMF gadgets and self-destruct sequences',
    },
    servers: [
      {
        url: 'http://localhost:8088/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
          },
        },
        Gadget: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Gadget ID',
            },
            name: {
              type: 'string',
              description: 'Gadget name',
            },
            codename: {
              type: 'string',
              description: 'Spy codename',
            },
            description: {
              type: 'string',
              description: 'Gadget description',
            },
            status: {
              type: 'string',
              enum: ['Available', 'Deployed', 'Destroyed', 'Decommissioned'],
              description: 'Gadget status',
            },
            createdById: {
              type: 'integer',
              description: 'ID of user who created the gadget',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
            decommissionedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Decommission timestamp',
            },
            missionSuccessProbability: {
              type: 'integer',
              minimum: 70,
              maximum: 100,
              description: 'Random mission success probability percentage',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            password: {
              type: 'string',
              description: 'User password',
            },
          },
        },
        SignupRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            password: {
              type: 'string',
              description: 'User password',
            },
          },
        },
        CreateGadgetRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              description: 'Gadget name',
            },
            description: {
              type: 'string',
              description: 'Gadget description',
            },
            status: {
              type: 'string',
              enum: ['Available', 'Deployed', 'Destroyed', 'Decommissioned'],
              default: 'Available',
              description: 'Gadget status',
            },
          },
        },
        UpdateGadgetRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Gadget name',
            },
            description: {
              type: 'string',
              description: 'Gadget description',
            },
            status: {
              type: 'string',
              enum: ['Available', 'Deployed', 'Destroyed', 'Decommissioned'],
              description: 'Gadget status',
            },
          },
        },
        SelfDestructRequest: {
          type: 'object',
          properties: {
            confirmationCode: {
              type: 'string',
              pattern: '^[A-Z0-9]{8}$',
              description: '8-character alphanumeric confirmation code',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };
