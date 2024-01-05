import commentRepositories from "../repositories/commentRepositories.js";
import timelineRepositories from "../repositories/timelineRepositories.js";

export async function saveComments(req, res) {
  const { commentText } = req.body;
  const { postId } = req.params;
  const { userId } = res.locals;
  try {
    const checkPost = await timelineRepositories.checkPostExist(postId);
    if (checkPost.rowCount === 1) {
      await commentRepositories.postUserComments(
        commentText,
        postId,
        userId.userId
      );
      return res.sendStatus(201);
    }
    res.status(404).send("Post not found");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
