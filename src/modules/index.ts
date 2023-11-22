import path from "path";
import * as fs from "fs";
import { Express, Router } from "express";

const API_BASE_PATH = process.env.API_BASE_PATH || "/api";

module.exports = (app: Express) => {
  const modulesPath = fs.readdirSync(__dirname);

  // remove index.ts from array of modules
  modulesPath.splice(modulesPath.indexOf("index.ts"), 1);

  for (const baseModule of modulesPath) {
    const baseModulePath = path.join(__dirname, baseModule);
    
    if (fs.lstatSync(baseModulePath).isDirectory()) {
      const moduleFiles = fs.readdirSync(baseModulePath);

      for (const file of moduleFiles) {
        const extension = path.extname(file);
        const [base, suffix] = path.basename(file,extension).split(".");

        if (suffix != "routes") {
          continue
        }

        const filePath = path.join(baseModulePath, file);
        const moduleRouter: Router = require(filePath).default;

        app.use(`${API_BASE_PATH}/${base}`, moduleRouter);
      }
    }
  }
};
