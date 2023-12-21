import db from "../config/db.js";

async function savePostsInfos(description, url, userId) {
  return db.query(
    `INSERT INTO posts (description,url,"userId")
  VALUES ($1,$2,$3)
  `,
    [description, url, userId]
  );
}

async function getPostsInfos() {
  const limit = 20;
  return db.query(
    `SELECT p.url AS url ,p.description AS description, u.name AS name ,u.image AS image, COUNT(l."postId") AS likes 
    FROM 
      posts p
    JOIN  
      users u ON p."userId"=u.id
    LEFT JOIN 
      likes l ON l."postId"=p.id
    GROUP BY
      p.id,u.name,u.image
    ORDER BY
      p."createdAt" DESC
    LIMIT $1
  `,
    [limit]
  );
}

async function updatePostDescription(description, id, userId) {
  return db.query(
    `UPDATE 
      posts 
    SET 
      description=$1
    WHERE 
      "userId"=$2
    AND id=$3
  `,
    [description, userId, id]
  );
}

const timelineRepositories = {
  savePostsInfos,
  getPostsInfos,
  updatePostDescription,
};

export default timelineRepositories;
