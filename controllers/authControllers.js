import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import userRepositories from "../repositories/userRepositories.js";

export async function signUp(req, res) {
  const { name, email, password, image } = req.body;

  const passwordHash = bcrypt.hashSync(password, 10);
  try {
    const querySignUp = await userRepositories.saveUserInfos(
      name,
      email,
      passwordHash,
      image
    );
    res.status(201).send("user registered");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
