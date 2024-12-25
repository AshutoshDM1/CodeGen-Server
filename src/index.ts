import express from "express";
import cors from "cors";
import router from "./routes/route";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const port: Number = process.env.PORT ? parseInt(process.env.PORT) : 4000;

app.use("/api", router);

app.get("/", async (req, res) => {
  res.status(200).json({ msg: "Welcome to CodeGen Server" });
});

app.listen(port, () => {
  console.log(`Server is runing on port http://localhost:${port}`);
});
