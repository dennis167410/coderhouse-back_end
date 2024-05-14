export const swaggerOptions = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "Documentación Proyecto ecommerce",
        description: "API de módulos products y carts",
        version: "1.0.0",
      },
    },
    apis: [`./src/docs/**/*.yml`],
  };
