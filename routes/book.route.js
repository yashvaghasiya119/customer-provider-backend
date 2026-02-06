import express from "express";
import { CreateBook, getAllBooks } from "../controller/book.controller.js"

const router = express.Router();

router.post("/create", CreateBook);

router.get("/allbooks", getAllBooks);

export default router;