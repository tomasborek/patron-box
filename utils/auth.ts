import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authentificate = (token: string) => {
  try {
    const valid = jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
};

export const authorize = (
  token: string,
  id: number = null,
  email: string = null
) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id != id && decoded.email != email) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const authorizeAdmin = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email != process.env.ADMIN_EMAIL) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};
