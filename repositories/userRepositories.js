import db from "../config/db.js";

async function saveUserInfos(name, email, passwordHash, image) {
  return db.query(
    `INSERT INTO users (name,email,password,image)
  SELECT $1,$2,$3,$4
  WHERE NOT EXISTS (SELECT email FROM users WHERE email=$2)
  `,
    [name, email.toLowerCase(), passwordHash, image]
  );
}

async function getUserByEmail(email) {
  return db.query(
    `
    SELECT * FROM users 
    WHERE email=$1
    `,
    [email]
  );
}

async function createSession(token, id) {
  return db.query(
    `
    INSERT INTO sessions 
    (token,"userId")
    VALUES ($1,$2)
    `,
    [token, id]
  );
}

const userRepositories = {
  saveUserInfos,
  getUserByEmail,
  createSession,
};

export default userRepositories;
