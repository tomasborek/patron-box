import jwt from "jsonwebtoken";

export const authentificate = (token: string) => {
  token = token.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
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
  token = token.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id != id && decoded.email != email) return false;
    return true;
  } catch (error) {
    return false;
  }
};

export const authorizeAdmin = (token: string) => {
  token = token.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.admin) return false;
    return true;
  } catch (error) {
    return false;
  }
};
