import express, { Request, Response } from "express";
import connectDB from "./db/connect";
import userRoutes from "./routes/userRoutes";
import noteRoutes from "./routes/noteRoutes";

import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use user routes
app.use("/api/users", userRoutes);
app.use('/api', noteRoutes);  // Note routes

// Basic route to check if the server is working
app.get("/", (req: Request, res: Response) => {
    res.send("API is working");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
