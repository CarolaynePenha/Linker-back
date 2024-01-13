import db from "../config/db.js";

async function postRePost(postId, userId) {
  return db.query(
    `INSERT INTO repost ("postId","userId")
     VALUES ($1,$2)

  `,
    [postId, userId]
  );
}

async function getRePosts(id, page) {
  const limit = 5;
  let offset = 0;
  if (page) {
    offset = limit * page;
  }
  return db.query(
    `SELECT re.id AS "rePostId", re."userId" AS "rePostUserId",re."createdAt",us.name AS "rePostName", p.id, p."userId" AS "postUserId",
	p.url,p.description , u.name,u.image, COUNT(l."postId") AS likes
	FROM repost re
	JOIN  
      users us ON re."userId"=us.id
	JOIN follow f ON f."followedId"=re."userId"
	JOIN posts p  on p.id=re."postId"
	JOIN  
      users u ON p."userId"=u.id
	 LEFT JOIN 
      likes l ON l."postId"=re."postId"
	 WHERE f."followerId"=$1
	  GROUP BY
      re.id,f.id,p.id,l.id,u.id,us.name
    ORDER BY
      re."createdAt" DESC
    OFFSET($3)
    LIMIT $2
      `,
    [id, limit, offset]
  );
}

async function getUserRePost(id) {
  return db.query(
    `SELECT re.id AS "rePostId", re."userId" AS "rePostUserId",us.name AS "rePostName", p.id, p."userId" AS "postUserId",
	p.url,p.description , u.name,u.image, COUNT(l."postId") AS likes
	FROM repost re
	JOIN  
      users us ON re."userId"=us.id
	JOIN posts p  on p.id=re."postId"
	JOIN  
      users u ON p."userId"=u.id
	 LEFT JOIN 
      likes l ON l."postId"=re."postId"
	 WHERE re."userId"=$1
	  GROUP BY
      re.id,p.id,l.id,u.id,us.name
    ORDER BY
      re."createdAt" DESC`,
    [id]
  );
}

async function getCountRePosts() {
  return db.query(
    `SELECT "postId", COUNT("postId") AS "countRePost"
      FROM repost
        GROUP BY
        "postId"
`
  );
}

async function deleteRePost(id) {
  return (
    db.query(
      ` DELETE FROM repost
          WHERE id=$1`
    ),
    [id]
  );
}
async function deletePostOnRepost(id) {
  return db.query(
    ` DELETE FROM repost
          WHERE "postId"= $1
          `,
    [id]
  );
}
async function getCountOfNewRePosts(id, postId) {
  return db.query(
    ` 
    SELECT COUNT(re.id) FROM repost re
    LEFT JOIN 
	    follow f ON f."followedId"=re."userId"
	  WHERE f."followerId"= $1
	  AND re.id > $2`,
    [id, postId]
  );
}

const rePostRepositories = {
  postRePost,
  getRePosts,
  deleteRePost,
  getCountRePosts,
  getUserRePost,
  getCountOfNewRePosts,
  deletePostOnRepost,
};

export default rePostRepositories;
