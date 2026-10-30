
import express from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./docs/openApi.js";
import subscriptionRouter from "./routes/subscriptionRoutes.js";
import healthRouter from "./routes/healthRoutes.js";

const app = express();

app.use(express.json());

// Root health message
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Subscription API is running",
  });
});

// Mount subscription routes
app.use("/api/subscriptions", subscriptionRouter);

// Raw OpenAPI specification
app.get("/openapi.json", (req, res) => {
  res.status(200).json(openApiDocument);
});

// Interactive Swagger documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use("/health", healthRouter);

export default app; 
