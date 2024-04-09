import express, { Request, Response, NextFunction } from "express";

const app = express();

app.use("/", (req: Request, res: Response, next: NextFunction) => {
  return res.send("Customer");
});

app.listen(5001, () => {
  console.log(`Server is up on port: 5001`);
});
