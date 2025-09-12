export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        // pastikan selalu throw instance Error
        if (!(err instanceof Error)) {
            next(new Error(err?.message || "Unexpected Error"));
        }
        else {
            next(err);
        }
    });
};
//# sourceMappingURL=asyncHandler.js.map