import rePostRepositories from "../repositories/rePostReposotories.js";
import timelineRepositories from "../repositories/timelineRepositories.js";

export async function saveRePost(req, res) {
  const { postId } = req.params;
  const { userId } = res.locals;
  try {
    const checkPost = await timelineRepositories.checkPostExist(postId);
    if (checkPost.rowCount === 1) {
      await rePostRepositories.postRePost(postId, userId.userId);
      return res.sendStatus(201);
    }
    res.status(404).send("Post not found");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function deleteRePost(req, res) {
  const { rePostId } = req.params;
  try {
    await rePostRepositories.deleteRePost(rePostId);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
