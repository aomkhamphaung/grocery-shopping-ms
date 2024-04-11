import { Request, Response, NextFunction } from "express";
import { ValidateToken } from "../../utils";

export const UserAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isAuthorized = await ValidateToken(req);

  if (isAuthorized) {
    return next();
  }

  return res.status(403).json({ message: "Unauthorized!" });
};
