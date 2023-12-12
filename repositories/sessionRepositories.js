import db from "../config/db.js";

async function getToken(token) {
  return db.query(
    `
    SELECT "userId" FROM  sessions 
    WHERE token=$1
    `,
    [token]
  );
}
const sessionRepository = {
  getToken,
};

export default sessionRepository;
