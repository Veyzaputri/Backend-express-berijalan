import jwt from "jsonwebtoken";
export const UGenerateToken = (payload) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d", // expired dalam 1 hari, bisa diubah sesuai kebutuhan
    });
};
//# sourceMappingURL=generateToken.js.map