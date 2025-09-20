import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export function sanitizeRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //convert all string fields to lowercase
    if (req.body && typeof req.body === "object") {
    }
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim().toLowerCase();
      }
    });

    if (req.query && typeof req.query === "object") {
      Object.keys(req.query).forEach((key) => {
        if (typeof req.query[key] === "string") {
          req.query[key] = (req.query[key] as string).trim().toLowerCase();
        }
      });
    }

    next();
  } catch (error) {
    console.error("Sanitize error:", error);
    res.status(400).json({
      error: "invalid request format",
    });
  }
}

//validate request using express validator middleware
export function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }
  next();
}
