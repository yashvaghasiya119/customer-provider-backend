import express from "express";
import cookieParser from "cookie-parser";
import { mongoConnection } from "./mongoose.config.js";
import authRoutes from "./routes/user.route.js";
import creditRoutes from "./routes/credit.route.js";
import providerRoutes from "./routes/provider.route.js";
import { authorize } from "./auth.middelwere.js";
import { userIsAdmin } from "./admin.middelwere.js";

const app = express();
const PORT = 7000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

mongoConnection();
app.use("/api/auth", authRoutes);
app.use("/api/credits", authorize,userIsAdmin, creditRoutes);
app.use("/api/providers",authorize, providerRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  return res.send("Backend is running 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


