import db from "../config/db.js";

async function savePostsInfos(description, url, userId) {
  return db.query(
    `INSERT INTO posts (description,url,"userId")
  VALUES ($1,$2,$3)
  `,
    [description, url, userId]
  );
}
const timelineRepositories = {
  savePostsInfos,
};
export default timelineRepositories;
