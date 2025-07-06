import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./config/db";
import authRoutes from "../src/routes/auth.routes";
import gadgetRoutes from "../src/routes/gadget.routes";
import { swaggerUi, specs } from "./config/swagger";

const app = express();
const port = process.env.PORT || 8088;

app.use(express.json());
app.use(cors());

db.connect()
  .then((client) => {
    console.log("Successfully connected to PostgreSQL database");
    client.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database", err.message);
    process.exit(1);
  });

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRoutes);
app.use("/api/gadgets", gadgetRoutes);

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
