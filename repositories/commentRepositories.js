import db from "../config/db.js";

async function postUserComments(commentText, postId, userId) {
  return db.query(
    `INSERT INTO "userComments" ("commentText","postId","userId")
      VALUES ($1,$2,$3)
      `,
    [commentText, postId, userId]
  );
}
async function getUserComments() {
  return db.query(
    `SELECT ucom."commentText",ucom."postId",ucom."userId",u.name,u.image
     FROM "userComments" ucom
     JOIN users u ON ucom."userId"=u.id
     
        `
  );
}

async function getUserCommentsById(id) {
  return db.query(
    `SELECT ucom."commentText",ucom."postId",ucom."userId",u.name,u.image
    FROM "userComments" ucom
    JOIN users u ON ucom."userId"=u.id
    JOIN posts po ON ucom."postId"=po.id
    WHERE po."userId"=$1
     
        `,
    [id]
  );
}

async function getUserCommentsByHashtag(hashtag) {
  return db.query(
    `SELECT ucom."commentText",ucom."postId",ucom."userId",u.name,u.image
    FROM "userComments" ucom
    JOIN users u ON ucom."userId"=u.id
  JOIN posts po ON ucom."postId"=po.id
  JOIN "hashtagPost" hp ON ucom."postId"=hp."postId"
  JOIN hashtags hash ON hash.id=hp."hashtagId"
  WHERE hash.name=$1
        `,
    [hashtag.toLowerCase()]
  );
}
async function deletePostFromTableComments(postId) {
  return db.query(
    `DELETE FROM
    "userComments" 
    WHERE 
    "postId"=$1
  `,
    [postId]
  );
}
const commentRepositories = {
  postUserComments,
  getUserComments,
  getUserCommentsById,
  getUserCommentsByHashtag,
  deletePostFromTableComments,
};
export default commentRepositories;
