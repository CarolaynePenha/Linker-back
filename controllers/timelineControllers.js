import timelineRepositories from "../repositories/timelineRepositories.js";
import getMetadata from "./metadata.js";

export async function publishPost(req, res) {
  const { description, url } = req.body;
  const { userId } = res.locals;
  try {
    const queryPost = await timelineRepositories.savePostsInfos(
      description,
      url,
      userId.userId
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
export async function getPosts(req, res) {
  try {
    const { rows } = await timelineRepositories.getPostsInfos();

    const queryLikeInfos = await timelineRepositories.getLikeInfos();
    const likeInfos = queryLikeInfos.rows;

    const arrPosts = [];
    const { userId } = res.locals;
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
    console.dir(arrComplete, { depth: null });
    res.status(200).send(arrComplete);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function updatePost(req, res) {
  const { description } = req.body;
  const { id } = req.params;
  const { userId } = res.locals;
  try {
    const queryUpdatePost = await timelineRepositories.updatePostDescription(
      description,
      id,
      userId.userId
    );
    if (queryUpdatePost.rowCount === 1) {
      res.sendStatus(201);
    } else {
      res.status(404).send("Not Found");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
export async function deletePost(req, res) {
  const { id } = req.params;
  const { userId } = res.locals;
  try {
    await timelineRepositories.DeletePostFromTableLikes(id);
    const queryDeletePost = await timelineRepositories.deletePosts(
      id,
      userId.userId
    );
    if (queryDeletePost.rowCount === 1) {
      res.sendStatus(200);
    } else {
      res.status(404).send("Not Found");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
export async function checkLikeExist(req, res) {
  const { id } = req.params;
  const {
    userId: { userId },
  } = res.locals;

  try {
    const queryPostExist = await timelineRepositories.checkPostExist(id);
    if (queryPostExist.rowCount === 1) {
      const queryCheck = await timelineRepositories.checkLike(id, userId);
      if (queryCheck.rowCount === 1) {
        await timelineRepositories.deletePostLikes(id, userId);
        return res.status(200).send("Like removed");
      }
      await timelineRepositories.savePostLikes(id, userId);
      return res.status(200).send("Like saved");
    }
    return res.status(404).send("Post not found");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
