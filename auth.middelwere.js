import jwt from "jsonwebtoken";

export const authorize = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check header exists
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "yash");

    req.user = decoded;

    next(); // ✅ allow access
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

