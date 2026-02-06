import express from "express";
import { findProvider } from "../controller/provider.controller.js";

const router = express.Router();

router.get("/findprovider", findProvider);

export default router;