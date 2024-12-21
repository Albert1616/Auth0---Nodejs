import { Router } from "express";
import { createUser, getUsers } from "../controller/user";

//USER ROUTES
const route = Router();
route.get("/", getUsers);
route.post("/", createUser);

export default route;