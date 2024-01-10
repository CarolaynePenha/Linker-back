import followRepositories from "../repositories/followRepositories.js";

export async function getFollowersIds(req, res) {
  try {
    const { userId } = res.locals;
    const followerId = userId.userId;
    const { id } = req.params;
    const followersIds = await followRepositories.getFollowers(followerId, id);
    if (followersIds.rowCount === 1) {
      return res.status(200).send({ following: true });
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function following(req, res) {
  const { userId } = res.locals;
  const followerId = userId.userId;
  const { id } = req.params;
  const followingExist = await followRepositories.getFollowers(followerId, id);
  try {
    if (followingExist.rowCount === 1) {
      await followRepositories.deleteFollowers(followerId, id);
      return res.sendStatus(201);
    } else if (followingExist.rowCount === 0) {
      await followRepositories.saveFollowed(followerId, id);
      return res.sendStatus(200);
    }
    return res.sendStatus(400);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function getAllFollowers(req, res) {
  try {
    const { userId } = res.locals;
    const followerId = userId.userId;
    const followersIds = await followRepositories.getAllFolloweds(followerId);
    return res.status(200).send(followersIds.rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
