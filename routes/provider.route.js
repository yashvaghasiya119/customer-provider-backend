import express from "express";
import { getProviderWithRange } from "../controller/provider.controller.js";

const router = express.Router();

router.get("/nearprovider", getProviderWithRange);

export default router;