import db from "../config/db.js";

async function saveUserInfos(name, email, passwordHash, image) {
  return db.query(
    `INSERT INTO users (name,email,password,image)
  SELECT $1,$2,$3,$4
  WHERE NOT EXISTS (SELECT email FROM users WHERE email=$2)
  `,
    [name, email, passwordHash, image]
  );
}

const userRepositories = {
  saveUserInfos,
};

export default userRepositories;
