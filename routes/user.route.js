import express from "express";
import { allUser, login, signup } from "../controller/user.controller.js";
import {authorize} from "../auth.middelwere.js";


const router = express.Router();

router.post("/register", signup);

router.post("/login",login);

router.get("/getalluser",authorize, allUser);

export default router;