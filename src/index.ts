import express from "express";
import cors from "cors";
import db from "./config/db";

const port = process.env.PORT || 8088;

const app = express();

app.use(cors());
app.use(express.json());

db.connect()
  .then((client) => {
    console.log("Successfully connected to PostgreSQL database");
    client.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database");
    process.exit(1);
  });

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
