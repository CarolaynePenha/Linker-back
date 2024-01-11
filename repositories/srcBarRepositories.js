import db from "../config/db.js";

async function getUserNames(src, id) {
  return db.query(
    `
    SELECT u.name, u.image, u.id
    FROM users u
    LEFT JOIN (
    SELECT "followedId", 
           "followerId"
      FROM follow
      WHERE "followerId" = 6
    ) f ON f."followedId" = $2
  WHERE u.name ILIKE $1
  ORDER BY 
    CASE 
        WHEN f."followerId" IS NOT NULL THEN 0 
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
