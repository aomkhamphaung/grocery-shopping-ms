import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.use("/", (req: Request, res: Response, next: NextFunction) => {
  return res.json("Products");
});

app.listen(5002, () => {
  console.log(`Server is up on port: 5002`);
});
