import { config } from "dotenv";
import { executesUserCrudOperations } from "./userCrud.js";

// Load environment variables from .env file
config();
await executesUserCrudOperations();