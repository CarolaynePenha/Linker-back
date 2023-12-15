import timelineRepositories from "../repositories/timelineRepositories.js";

export async function publishPost(req, res) {
  const { description, url } = req.body;
  const { userId } = res.locals;
  try {
    const queryPost = await timelineRepositories.savePostsInfos(
      description,
      url,
      userId.userId
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
