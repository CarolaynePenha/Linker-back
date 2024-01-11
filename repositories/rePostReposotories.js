import db from "../config/db.js";

async function postRePost(postId, userId) {
  return db.query(
    `INSERT INTO repost ("postId","userId")
     VALUES ($1,$2)

  `,
    [postId, userId]
  );
}

async function getRePosts(id) {
  return db.query(
    `SELECT re.id AS "rePostId", re."userId" AS "rePostUserId",us.name AS "rePostName", p.id, p."userId" AS "postUserId",
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
      re."createdAt" DESC`,
    [id]
  );
}

async function deleteRePost(id) {
  return db.query(
    ` DELETE FROM repost
          WHERE id=4`
  );
}

const rePostRepositories = {
  postRePost,
  getRePosts,
  deleteRePost,
};

export default rePostRepositories;
