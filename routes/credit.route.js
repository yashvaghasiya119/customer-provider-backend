import express from "express";

const router = express.Router();

router.post("/create", (req, res) => {
  res.send("Create Credit");
});

router.get("/allcredits", (req, res) => {
  res.send("Get All Credits");
});

export default router;