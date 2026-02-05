import User from "../models/user.js"
import jwt from "jsonwebtoken"


const protect = (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();

    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  } catch (error) {
    res.status(401);
    throw new Error("Token verification failed");
  }
};

export default protect;