import db from "../config/db.js";

async function getUserNames(src, id) {
  return db.query(
    `
    SELECT u.name, u.image, u.id
    FROM users u
    LEFT JOIN follow f ON f."followedId" = u.id
    WHERE 
      u.name ILIKE $1
    ORDER BY 
      CASE 
        WHEN f."followerId" = $2 THEN 0 
        ELSE 1                          
      END
     
    `,
    ["%" + src + "%", id]
  );
}

const srcBarRepositories = {
  getUserNames,
};
export default srcBarRepositories;
