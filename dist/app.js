import express from "express";
import cors from "cors";
import authRoutes from './routes/auth.route.js';
import { MErrorHandler } from "./middlewares/error.middleware.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use(MErrorHandler);
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
//# sourceMappingURL=app.js.map