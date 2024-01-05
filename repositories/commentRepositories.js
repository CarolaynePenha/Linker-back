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
     
        `,
    []
  );
}

const commentRepositories = {
  postUserComments,
  getUserComments,
};
export default commentRepositories;
