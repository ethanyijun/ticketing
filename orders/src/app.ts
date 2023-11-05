import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NotFoundError, currentUser, errorHandler } from "@ethtickets/common";
import { createOrdersRouter } from "./routes/create-orders";
import { getOrderRouter } from "./routes/get-order";
import { getOrdersRouter } from "./routes/get-orders";
import { cancelOrderRouter } from "./routes/cancel-order";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);
app.use(createOrdersRouter);
app.use(getOrderRouter);
app.use(getOrdersRouter);
app.use(cancelOrderRouter);
app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);
export { app };
