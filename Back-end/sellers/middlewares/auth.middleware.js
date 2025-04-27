import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const seller_roleBased = (roles) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "token not found..." });

  try {
    const decoded = jwt.verify(token, process.env.jwtsecret);
    if (decoded) {
      req.user = decoded;
      if (roles.includes(decoded.role)) next();
      else res.sendStatus(403);
    }
  } catch (e) {
    if(e.name ==='TokenExpiredError') res.status(401).json('token expired please login')
        if(e.name==='JsonWebTokenError') res.status(401).json('Invalid token')
        else res.status(500).json({message:e.message})
      console.log(e);
  }
};
