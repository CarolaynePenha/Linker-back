import followRepositories from "../repositories/followRepositories.js";
import srcBarRepositories from "../repositories/srcBarRepositories.js";

export async function getSrcNames(req, res) {
  try {
    const { userId } = res.locals;
    const { src } = req.query;
    const srcNames = await srcBarRepositories.getUserNames(src, userId.userId);
    const following = await followRepositories.getAllFolloweds(userId.userId);
    let arrComplete = [];
    const followingCount = Number(following.rowCount);
    const arrToSend = srcNames.rows.map((srcInfos, index) => {
      if (index < followingCount) {
        return (arrComplete = { ...srcInfos, following: true });
      } else {
        return (arrComplete = { ...srcInfos, following: false });
      }
    });
    res.status(200).send(arrToSend);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
