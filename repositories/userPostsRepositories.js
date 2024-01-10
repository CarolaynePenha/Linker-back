import db from "../config/db.js";

async function getUserPostsInfos(id) {
  const limit = 20;
  return db.query(
    `SELECT p.id AS id, p."userId" AS "postUserId", p.url AS url ,p.description AS description, u.name AS name ,u.image AS image, COUNT(l."postId") AS likes 
      FROM 
        posts p
      JOIN  
        users u ON p."userId"=u.id
      LEFT JOIN 
        likes l ON l."postId"=p.id
    WHERE u.id=$1
      GROUP BY
        p.id,u.name,u.image
      ORDER BY
        p."createdAt" DESC
      LIMIT $2
    `,
    [id, limit]
  );
}
async function getUserLikeInfos(id) {
  return db.query(
    `
    SELECT u.name AS name, l."userId" AS "userId",l."postId"
    FROM 
      likes l
  LEFT JOIN 
      users u ON l."userId"=u.id
    LEFT JOIN 
      posts po ON po.id=l."postId"
   WHERE po."userId"=$1
     
    `,
    [id]
  );
}

const userPostsRepositories = {
  getUserPostsInfos,
  getUserLikeInfos,
};
export default userPostsRepositories;
