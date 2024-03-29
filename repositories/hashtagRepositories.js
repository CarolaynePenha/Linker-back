import db from "../config/db.js";

async function getHashtagId(hashtag) {
  return db.query(
    `
        SELECT id
        FROM 
          hashtags
       WHERE name ILIKE $1
       
      `,
    [hashtag]
  );
}
async function existHashtagId(hashtagId) {
  return db.query(
    `
        SELECT id
        FROM 
          "hashtagPost"
       WHERE "hashtagId"=$1
       
      `,
    [hashtagId]
  );
}
async function saveHashtag(hashtag) {
  return db.query(
    `INSERT INTO hashtags (name)
    VALUES($1)
    RETURNING id;
  `,
    [hashtag.toLowerCase()]
  );
}

async function insertIds(hashtagId, postId) {
  return db.query(
    `INSERT INTO "hashtagPost" ("hashtagId","postId")
    VALUES ($1,$2)
    `,
    [hashtagId, postId]
  );
}

async function getPostByHashtag(hashtagId) {
  const limit = 20;
  return db.query(
    `SELECT p.id, p."userId" AS "postUserId", p.url,p.description , u.name ,u.image, h."hashtagId", COUNT(l."postId") AS likes 
        FROM 
          posts p
        JOIN  
          users u ON p."userId"=u.id
        LEFT JOIN 
          likes l ON l."postId"=p.id
        LEFT JOIN 
        "hashtagPost" h ON h."postId"=p.id
      WHERE h."hashtagId"=$1
        GROUP BY
          p.id,u.name,u.image,h."hashtagId"
        ORDER BY
          p."createdAt" DESC
        LIMIT $2
      `,
    [hashtagId, limit]
  );
}

async function getPostLikesByHashtag(hashtagId) {
  return db.query(
    `
      SELECT u.name, l."userId",l."postId"
      FROM 
        likes l
      LEFT JOIN 
        users u ON l."userId"=u.id
      LEFT JOIN 
        "hashtagPost" h ON h."postId"=l."postId"
      WHERE h."hashtagId"=$1
     
    `,
    [hashtagId]
  );
}

async function deletePostFromTableHashtagPost(id) {
  return db.query(
    `DELETE FROM
    "hashtagPost" 
    WHERE 
      "postId"=$1
    RETURNING "hashtagId";
  `,
    [id]
  );
}

async function deletePostFromTableHashtag(hashtagId) {
  return db.query(
    `DELETE FROM
    hashtags 
    WHERE 
      id=$1
  `,
    [hashtagId]
  );
}

async function getTrending() {
  return db.query(
    `
    SELECT COUNT  
      ("hashtagId"), hashtags.name,hashtags.id
    FROM 
      "hashtagPost"
    JOIN 
      hashtags ON hashtags.id="hashtagPost"."hashtagId"
    GROUP BY
      ("hashtagId",hashtags.name,hashtags.id)
    ORDER BY 
      count DESC
    LIMIT 10
       
      `
  );
}

const hashtagRepositories = {
  saveHashtag,
  getHashtagId,
  insertIds,
  getPostByHashtag,
  getPostLikesByHashtag,
  deletePostFromTableHashtagPost,
  deletePostFromTableHashtag,
  existHashtagId,
  getTrending,
};

export default hashtagRepositories;
