import { config } from "dotenv";
import { executesUserCrudOperations } from "./userCrud.js";

config();
await executesUserCrudOperations();