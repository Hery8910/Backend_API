const swaggerJsDoc = require("swagger-jsdoc"); // Import Swagger documentation generation tool
const swaggerUi = require("swagger-ui-express"); // Import Swagger UI to serve the documentation in a web interface

// Define the Swagger configuration options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", // Specify the OpenAPI version (Swagger 3.0)
    info: {
      title: "Cleaning Service API", // Title of the API documentation
      version: "1.0.0", // API version
      description: "API documentation for Cleaning Service", // Short description of the API
      contact: {
        name: "Developer", // Contact information for the developer
        email: "developer@example.com" // Developer's email
      }
    },
    servers: [
      {
        url: "http://localhost:5000", // URL for your development server
        description: "Development Server" // Label for the server (you can add more servers for production or staging)
      }
    ]
  },
  apis: ["./routes/*.js"] // Path to the routes where Swagger should look for annotations to generate the documentation
};

// Generate the Swagger documentation based on the provided options
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Export the generated Swagger documentation and the Swagger UI
module.exports = { swaggerDocs, swaggerUi };
