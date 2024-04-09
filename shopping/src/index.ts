import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.use("/", (req: Request, res: Response, next: NextFunction) => {
  return res.json("Shopping");
});

app.listen(5003, () => {
  console.log(`Server is up on port: 5003`);
});
