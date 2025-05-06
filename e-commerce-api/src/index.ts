import { app } from "./app";
import { mongoDBClient } from "@config/database";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.SERVER_PORT || 3000;

const startServer = async () => {
  await mongoDBClient.connect();

  app.listen(PORT, () => {
    console.log(`[Server]: Running on port ${PORT}`);
  });
};

startServer();
