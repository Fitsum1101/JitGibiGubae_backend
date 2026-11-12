/** Load `.env` before any module that reads `process.env` (e.g. `db.ts`). */
import "dotenv/config";

import path from "node:path";
import { fileURLToPath } from "node:url";

import express, { type Request, type Response } from "express";
import cors from "cors";

import { i18nMiddleware } from "./middleware/localizationMiddleware";
import { errorHandler, notFoundHandler } from "./utils/errorHandler";

errorHandler;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Trust proxy configuration
app.set("trust proxy", 1);

// app.use(cors());

// ===== 🌐 CORS Middleware Setup =====
const allowedOrigins = process.env.FRONTEND_URL_CORS?.split(",").map((origin) =>
  origin.trim(),
);
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    exposedHeaders: ["Content-Language", "X-Content-Language"],
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(i18nMiddleware);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req: Request, res: Response) => {
  const response = {
    language: req.i18n?.language,
    userName: req.t?.("user.name"),
  };

  res.json(response);
});

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
export default app;
