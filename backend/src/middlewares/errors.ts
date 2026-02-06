import { Request, Response, NextFunction } from "express";

//custom Error type

// export class CustomError extends Error{

//     public statusCode: number;
//     public isOperational: boolean;

//     constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
//         super(message);
//         this.statusCode = statusCode;
//         this.isOperational = isOperational;

//         Error.captureStackTrace(this, this.constructor)

//     }
// }

class CustomError extends Error {
  public statusCode: number;

  constructor(message: any, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const customError = (message: any, statusCode: number) => {
  return new CustomError(message, statusCode);
};

export default function ErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }
}
