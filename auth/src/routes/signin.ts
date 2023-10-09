import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { Password } from "../services/password";
import { BadRequestError, validateRequest } from "@ethtickets/common";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password cannot be empty"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      console.log("Login request failed");
      throw new BadRequestError("Login request failed");
    }

    if (!Password.compare(password, existingUser.password)) {
      console.log("Login request failed");
      throw new BadRequestError("Login request failed");
    }

    const userToken = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userToken,
    };
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
