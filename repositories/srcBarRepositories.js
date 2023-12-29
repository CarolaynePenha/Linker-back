import db from "../config/db.js";

async function getUserNames(src) {
  return db.query(
    `
      SELECT name,image,id
      FROM 
        users
     WHERE name ILIKE $1
     
    `,
    ["%" + src + "%"]
  );
}

const srcBarRepositories = {
  getUserNames,
};
export default srcBarRepositories;
