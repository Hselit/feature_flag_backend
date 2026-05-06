import 'dotenv/config';
import 'reflect-metadata';
import "./zod";
import App from "./app";
import { seedRolesData } from './seed/roleData';

async function main() {
  try {
    await seedRolesData();
    await App.startServer(3000);
  } catch (error) {
    const detail =
      error instanceof Error
        ? `${error.name}: ${error.message}${error.stack ? `\n${error.stack}` : ''}`
        : String(error);
    console.error(`Failed to start the server: ${detail}`);
    process.exit(1);
  }
}

main();