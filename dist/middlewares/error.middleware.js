export const MErrorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    const isDevelopment = process.env.NODE_ENV === "development";
    if (err instanceof Error) {
        const response = {
            status: false,
            message: err.message,
        };
        const errorObj = { message: err.message };
        if (err.name) {
            errorObj.name = err.name;
        }
        if (isDevelopment && err.stack) {
            errorObj.detail = err.stack;
        }
        response.error = errorObj;
        res.status(400).json(response);
    }
    else {
        const response = {
            status: false,
            message: "An unexpected error occured",
            error: {
                message: "Internal server error",
                ...(isDevelopment && { detail: err.stack }),
            },
        };
        res.status(500).json(response);
    }
};
//# sourceMappingURL=error.middleware.js.map