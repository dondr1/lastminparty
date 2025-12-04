import { initSuperTokens } from "../../config/supertokens.js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import supertokens from "supertokens-node";
import { middleware, errorHandler } from "supertokens-node/framework/express";
import express from "express";

// Initialize SuperTokens config
initSuperTokens();

// Export handler to Vercel
export default function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");

  const app = express();
  app.use(middleware());
  app.use(errorHandler());

  return app(req, res);
}
