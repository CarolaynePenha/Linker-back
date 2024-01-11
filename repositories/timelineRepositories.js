import db from "../config/db.js";

async function savePostsInfos(description, url, userId) {
  return db.query(
    `INSERT INTO posts (description,url,"userId")
  VALUES ($1,$2,$3)
  RETURNING id;
  `,
    [description, url, userId]
  );
}

async function getPostsInfos(id) {
  const limit = 20;
  return db.query(
    `SELECT p.id, p."userId" AS "postUserId", p.url,p.description,
     u.name,u.image, COUNT(l."postId") AS likes 
    FROM 
      posts p
    JOIN  
      users u ON p."userId"=u.id
    LEFT JOIN 
      likes l ON l."postId"=p.id
	 LEFT JOIN 
	 follow f ON f."followedId"=p."userId"
	 WHERE f."followerId"=$1
    GROUP BY
      p.id,u.name,u.image
    ORDER BY
      p."createdAt" DESC
    LIMIT $2
  `,
    [id, limit]
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
async function DeletePostFromTableLikes(id) {
  return db.query(
    `DELETE FROM
      likes 
    WHERE 
      "postId"=$1
  `,
    [id]
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

async function getLikeInfos() {
  return db.query(
    `
    SELECT u.name, l."userId",l."postId"
    FROM 
      likes l
    LEFT JOIN 
      users u ON l."userId"=u.id
   
  `
  );
}

const timelineRepositories = {
  savePostsInfos,
  getPostsInfos,
  updatePostDescription,
  deletePosts,
  DeletePostFromTableLikes,
  savePostLikes,
  checkLike,
  deletePostLikes,
  checkPostExist,
  getLikeInfos,
};

export default timelineRepositories;
