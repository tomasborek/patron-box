import jwt from "jsonwebtoken";

export const authentificate = (token: string) => {
  try {
    token = token.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET);
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
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id != id && decoded.email != email) return decoded;
    return true;
  } catch (error) {
    return false;
  }
};

export const authorizeAdmin = (token: string) => {
  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.admin) return false;
    return decoded;
  } catch (error) {
    return false;
  }
};
