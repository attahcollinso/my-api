const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        githubOAuth: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: 'https://github.com/login/oauth/authorize',
              tokenUrl: 'https://github.com/login/oauth/access_token',
              scopes: {
                'read:user': 'Read user information',
              },
            },
          },
        },
      },
    },
    security: [
      {
        githubOAuth: ['read:user'],
      },
    ],
  },
  apis: ['./routes/*.js'], // Adjust the path to your route files
};

const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;
