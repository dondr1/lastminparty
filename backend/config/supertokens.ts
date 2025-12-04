import SuperTokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import dotenv from "dotenv";

dotenv.config();

export function initSuperTokens() {
  console.log("API_DOMAIN:", process.env.API_DOMAIN);
  console.log("APP_DOMAIN:", process.env.APP_DOMAIN);

  SuperTokens.init({
    framework: "express",
    supertokens: {
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!,
      apiKey: process.env.SUPERTOKENS_API_KEY,
    },
    appInfo: {
      appName: "LastMinParty",
      apiDomain: process.env.API_DOMAIN!, // http://localhost:3000
      websiteDomain: process.env.APP_DOMAIN!, // http://localhost:19006
      apiBasePath: "/api/auth",
    },
    recipeList: [EmailPassword.init(), Session.init()],
    isInServerlessEnv: true,
  });
}
