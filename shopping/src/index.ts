import express, { Request, Response, NextFunction } from "express";

const app = express();

app.use("/", (req: Request, res: Response, next: NextFunction) => {
  return res.send("Shopping");
});

app.listen(5003, () => {
  console.log(`Server is up on port: 5003`);
});
