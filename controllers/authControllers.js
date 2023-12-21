import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import userRepositories from "../repositories/userRepositories.js";

export async function signUp(req, res) {
  const { name, email, password, image } = req.body;

  const passwordHash = bcrypt.hashSync(password, 10);
  try {
    const UserExist = await userRepositories.getUserByEmail(email);
    console.log("UserExist.rowCount: ", UserExist.rowCount);
    if (UserExist.rowCount !== 0) {
      return res.status(409).send("e-mail already exists");
    }
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
    const infoUser = await userRepositories.getUserByEmail(email.toLowerCase());
    if (
      infoUser.rowCount === 1 &&
      bcrypt.compareSync(password, infoUser.rows[0].password)
    ) {
      const token = uuid();
      const { id, name, image } = infoUser.rows[0];
      const queryToken = await userRepositories.createSession(token, id);
      res.status(200).send({ token: token, name: name, image: image });
    } else {
      res.status(404).send("user not found");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
