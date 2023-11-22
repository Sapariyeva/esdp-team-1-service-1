import { ValidationError } from "class-validator";
import { ErrorRequestHandler } from "express";

export const errorHandler = (): ErrorRequestHandler => (err, req, res, next) => {
  console.log(err);
  if (Array.isArray(err)) {
    let errMessages: {[key: string]: string} = {};
    err.map((err: ValidationError) => {
      for (const val in err.constraints) {
        if (errMessages[val]) {
          errMessages[val] += `. ${err.constraints[val]}`
        } else {
          errMessages[val] = err.constraints[val]
        }
      }
    })
    res.status(400).send({
      success: false,
      message: errMessages
    })
  } else {
    res.status(500).send({
      success: false,
      message: (err as Error).message
    });
  }
}