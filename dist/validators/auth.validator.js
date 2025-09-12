import Joi from "joi";
export const MValidate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new Error(error.details.map(d => d.message).join(", ")));
        }
        next();
    };
};
//# sourceMappingURL=auth.validator.js.map