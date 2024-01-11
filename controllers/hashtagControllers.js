import commentRepositories from "../repositories/commentRepositories.js";
import hashtagRepositories from "../repositories/hashtagRepositories.js";
import getMetadata from "./metadata.js";

export async function getPostByHashtag(req, res) {
  try {
    const { hashtag } = req.params;
    const { userId } = res.locals;
    const queryHashtagId = await hashtagRepositories.getHashtagId(hashtag);
    if (queryHashtagId.rowCount === 1) {
      const hashtagId = queryHashtagId.rows[0].id;
      const { rows } = await hashtagRepositories.getPostByHashtag(hashtagId);
      const queryLikeInfos = await hashtagRepositories.getPostLikesByHashtag(
        hashtagId
      );
      const userComments = await commentRepositories.getUserCommentsByHashtag(
        hashtag
      );
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
    } else {
      res.status(404).send("Not found");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function getHashtagTrending(req, res) {
  try {
    const trending = await hashtagRepositories.getTrending();
    res.status(200).send(trending.rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
