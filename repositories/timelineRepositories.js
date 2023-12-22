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
    `SELECT p.id AS id, p."userId" AS "postUserId", p.url AS url ,p.description AS description, u.name AS name ,u.image AS image, COUNT(l."postId") AS likes 
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
async function deletePosts(id, userId) {
  return db.query(
    `DELETE FROM
      posts 
    WHERE 
      "userId"=$1
    AND 
      id=$2
  `,
    [userId, id]
  );
}
async function checkLike(id, userId) {
  return db.query(
    `
      SELECT "postId" FROM likes
      WHERE "postId" = $1 AND "userId" = $2
  `,
    [id, userId]
  );
}
async function checkPostExist(id) {
  return db.query(
    `
      SELECT * FROM posts
      WHERE id = $1 
  `,
    [id]
  );
}
async function savePostLikes(id, userId) {
  return db.query(
    `INSERT INTO 
      likes ("postId","userId")
    VALUES ($1,$2)
  `,
    [id, userId]
  );
}
async function deletePostLikes(id, userId) {
  return db.query(
    `DELETE FROM likes  
     WHERE "postId" = $1 
     AND "userId" = $2
  `,
    [id, userId]
  );
}

const timelineRepositories = {
  savePostsInfos,
  getPostsInfos,
  updatePostDescription,
  deletePosts,
  savePostLikes,
  checkLike,
  deletePostLikes,
  checkPostExist,
};

export default timelineRepositories;
