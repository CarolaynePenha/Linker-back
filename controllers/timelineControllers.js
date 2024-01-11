import commentRepositories from "../repositories/commentRepositories.js";
import followRepositories from "../repositories/followRepositories.js";
import hashtagRepositories from "../repositories/hashtagRepositories.js";
import rePostRepositories from "../repositories/rePostReposotories.js";
import timelineRepositories from "../repositories/timelineRepositories.js";

import getMetadata from "./metadata.js";

export async function publishPost(req, res) {
  const { description, url } = req.body;
  const { userId } = res.locals;
  const hashtags = description?.match(/#\w+/g) || [];
  try {
    const queryPost = await timelineRepositories.savePostsInfos(
      description,
      url,
      userId.userId
    );
    const postId = queryPost.rows[0].id;
    if (hashtags) {
      let hashtagId;
      const arrHashtagsId = [];
      for (let i = 0; i < hashtags.length; i++) {
        const lookForHashtagId = await hashtagRepositories.getHashtagId(
          hashtags[i].slice(1)
        );

        if (lookForHashtagId.rowCount === 1) {
          hashtagId = lookForHashtagId.rows[0].id;
          arrHashtagsId.push(hashtagId);
        } else if (lookForHashtagId.rowCount == 0) {
          const saveHashtag = await hashtagRepositories.saveHashtag(
            hashtags[i].slice(1)
          );
          if (saveHashtag.rowCount === 1) {
            hashtagId = saveHashtag.rows[0].id;
            arrHashtagsId.push(hashtagId);
          }
        }
      }
      for (let i = 0; i < arrHashtagsId.length; i++) {
        await hashtagRepositories.insertIds(arrHashtagsId[i], postId);
      }
    }

    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function getPosts(req, res) {
  const { userId } = res.locals;
  try {
    const postInfos = await timelineRepositories.getPostsInfos(userId.userId);
    const rePostInfos = await rePostRepositories.getRePosts(userId.userId);
    const queryLikeInfos = await timelineRepositories.getLikeInfos();
    const likeInfos = queryLikeInfos.rows;
    const arrPosts = [];
    if (postInfos.rowCount === 0 && rePostInfos.rowCount === 0) {
      const lookForFollowed = await followRepositories.getAllFolloweds(
        userId.userId
      );
      if (lookForFollowed.rowCount === 0) {
        return res.status(200).send("Still don't follow anyone");
      }
      return res.status(200).send("No posts found");
    }
    for (let i = 0; i < postInfos.rows.length; i++) {
      const post = postInfos.rows[i];
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
    for (let i = 0; i < rePostInfos.rows.length; i++) {
      const post = rePostInfos.rows[i];
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
    // console.dir(arrComplete, { depth: null });
    const userComments = await commentRepositories.getUserComments();
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
    const queryHashTagId =
      await hashtagRepositories.deletePostFromTableHashtagPost(id);
    if (queryHashTagId.rowCount && queryHashTagId.rowCount >= 1) {
      const hashtagId = queryHashTagId?.rows[0].hashtagId;
      const existHashtag = await hashtagRepositories.existHashtagId(hashtagId);
      if (existHashtag.rowCount === 0) {
        await hashtagRepositories.deletePostFromTableHashtag(hashtagId);
      }
    }
    await commentRepositories.deletePostFromTableComments(id);
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
