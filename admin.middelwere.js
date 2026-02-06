export function userIsAdmin(req, res, next) {
  console.log("🚀 ~ userIsAdmin ~ req.user:", req.user)
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
}