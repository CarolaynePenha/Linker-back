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
    `SELECT url,description,"userId" FROM posts 
    ORDER BY "createdAt" DESC
    LIMIT $1
  `,
    [limit]
  );
}

const timelineRepositories = {
  savePostsInfos,
  getPostsInfos,
};

export default timelineRepositories;
