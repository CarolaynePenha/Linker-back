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

export async function signIn(req, res) {
  const { password, email } = req.body;

  try {
    const queryInfoUser = await userRepositories.getUserByEmail(email);
    if (
      queryInfoUser.rowCount === 1 &&
      bcrypt.compareSync(password, queryInfoUser.rows[0].password)
    ) {
      const token = uuid();
      const { id } = queryInfoUser.rows[0];
      const queryToken = await userRepositories.createSession(token, id);
      res.status(200).send(token);
    } else {
      res.status(404).send("user not found");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
