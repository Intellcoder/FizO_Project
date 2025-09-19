import { generateToken, verifyToken } from "../utils/jwt";
import User, { IUSER } from "../database/models/user.model";
import { Jwt, JwtPayload } from "jsonwebtoken";

export interface LoginResult {
  token: string;
  user: Omit<IUSER, "password">;
}

export class AuthServices {
  //verify user service
  async verifyUser(name: string): Promise<IUSER> {
    const user = await User.findOne({ name });

    if (!user) {
      throw new Error("user not found");
    }
    return user;
  }

  async getUserFromToken(token: string): Promise<Omit<IUSER, "password">> {
    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = (await verifyToken(token)) as JwtPayload & { id?: string };

    if (!decoded || !decoded.id) {
      throw new Error("Invalid token");
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  //service to register user
  async registerUser(
    email: string,
    name: string,
    password: string,
    locale: string
  ): Promise<{ user: IUSER; token: string }> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("user already exist");
    }
    const newUser = new User({
      email,
      name,
      password,
      locale,
    });
    await newUser.save();

    const token = generateToken(newUser._id.toString());
    return { user: newUser, token };
  }

  //service to login user

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new Error("User does not exist");
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new Error("Incorrect password");
    }
    const token = generateToken(user._id.toString());

    return {
      token,
      user: user,
    };
  }
}
