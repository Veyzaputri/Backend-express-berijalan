import type { Request, Response, NextFunction } from "express";
import Joi from "joi";


export const MValidate = (
    schema: Joi.ObjectSchema
 ) => {
    return( 
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        const {error} = schema.validate(req.body, {abortEarly: false});

        if(error) {
            return next(new Error(error.details.map(d => d.message).join(", ")));
            }

            next();
        };

    
    };


 