import commentRepositories from "../repositories/commentRepositories.js";
import userPostsRepositories from "../repositories/userPostsRepositories.js";
import getMetadata from "./metadata.js";

export async function getPostsById(req, res) {
  try {
    const { userId } = res.locals;
    const { id } = req.params;
    const { rows } = await userPostsRepositories.getUserPostsInfos(id);
    const queryLikeInfos = await userPostsRepositories.getUserLikeInfos(id);
    const userComments = await commentRepositories.getUserCommentsById(id);

    const likeInfos = queryLikeInfos.rows;
    const arrPosts = [];
    for (let i = 0; i < rows.length; i++) {
      const post = rows[i];
      const metadata = await getMetadata(post.url);
      const postDatas = {
        ...post,
        imageMetadata: metadata?.image || metadata?.jsonld["image"],
        descriptionMetadata: metadata?.description,
        titleMetadata: metadata?.title,
        userId: userId.userId,
      };
      arrPosts.push(postDatas);
    }

    const arrComplete = arrPosts.map((post) => {
      const likedBy = likeInfos.filter((item) => post.id === item.postId);
      const data = { ...post, likedBy };
      return data;
    });
    let arrToSend = [];
    if (userComments.rowCount && userComments.rowCount > 0) {
      arrToSend = arrComplete.map((post) => {
        const comments = userComments.rows.filter(
          (item) => post.id === item.postId
        );
        const data = { ...post, comments };
        return data;
      });
      return res.status(200).send(arrToSend);
    }
    res.status(200).send(arrComplete);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
