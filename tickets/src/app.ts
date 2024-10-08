import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NotFoundError, currentUser, errorHandler } from "@ethtickets/common";
import { createTicketsRouter } from "./routes/create-tickets";
import { getTicketsRouter } from "./routes/get-tickets";
import { getTicketRouter } from "./routes/get-ticket";
import { updateTicketRouter } from "./routes/update-ticket";
import { bookTicketRouter } from "./routes/book-ticket";
import { deleteTicketsRouter } from "./routes/delete-tickets";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(currentUser);
app.use(createTicketsRouter);
app.use(getTicketRouter);
app.use(getTicketsRouter);
app.use(updateTicketRouter);
app.use(deleteTicketsRouter);
app.use(bookTicketRouter);
app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);
export { app };
