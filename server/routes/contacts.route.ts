import express from "express";
import {
  getContactforDMList,
  searchContact,
} from "../controllers/contacts.controller";
import { isAuthenticated } from "../middleware/auth";
const contactsRouter = express.Router();

contactsRouter.post("/search-contacts", isAuthenticated, searchContact);
contactsRouter.get("/get-dm-contacts", isAuthenticated, getContactforDMList);

export default contactsRouter;
