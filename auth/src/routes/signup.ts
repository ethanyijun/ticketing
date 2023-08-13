import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
const router = express.Router();
import jwt from "jsonwebtoken";
import { validateRequest } from "../middleware/validate-request";

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      console.log("Email in use");
      throw new BadRequestError("Email in use");
    }
    const user = User.build({ email, password });
    await user.save();

    var userToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userToken,
    };
    res.status(201).send(user);
  }
);

export { router as signupRouter };
