import db from "../config/db.js";

async function saveFollowed(followerId, followedId) {
  return db.query(
    `INSERT INTO follow ("followerId","followedId")
     VALUES($1,$2)
  `,
    [followerId, followedId]
  );
}

async function getFollowers(followerId, followedId) {
  return db.query(
    `
    SELECT "followedId" FROM follow 
    WHERE "followerId"=$1
    AND "followedId"=$2
    `,
    [followerId, followedId]
  );
}

async function getAllFolloweds(followerId) {
  return db.query(
    `
    SELECT "followedId" FROM follow 
    WHERE "followerId"=$1
    `,
    [followerId]
  );
}

async function deleteFollowers(followerId, followedId) {
  return db.query(
    `DELETE FROM follow  
     WHERE "followerId" = $1 
     AND "followedId" = $2
  `,
    [followerId, followedId]
  );
}

const followRepositories = {
  saveFollowed,
  getFollowers,
  deleteFollowers,
  getAllFolloweds,
};
export default followRepositories;
