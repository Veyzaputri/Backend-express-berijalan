import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/auth.route.js';
import counterRoutes from "./routes/counter.route.js";
import queueRoutes from "./routes/queue.route.js"
import {MErrorHandler} from "./middlewares/error.middleware.js";
import {connectRedis} from "./configs/redis.config.js";

connectRedis();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/counters", counterRoutes);
app.use("/api/queue", queueRoutes);
app.use(MErrorHandler);


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
