import timelineRepositories from "../repositories/timelineRepositories.js";
import urlMetadata from "url-metadata";

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
export async function getPosts(req, res) {
  try {
    const { rows } = await timelineRepositories.getPostsInfos();
    const arrPosts = [];
    for (let i = 0; i < rows.length; i++) {
      const post = rows[i];
      const metadata = await getMetadata(post.url);
      const postDatas = {
        ...post,
        imageMetadata: metadata?.image || metadata?.jsonld["image"],
        descriptionMetadata: metadata?.description,
        titleMetadata: metadata?.title,
      };
      arrPosts.push(postDatas);
    }
    res.status(200).send(arrPosts);
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
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

async function getMetadata(url) {
  try {
    const metadata = await urlMetadata(url);
    console.log("metadata: ", metadata);
    return metadata;
  } catch (err) {
    console.log("fetch error:", err);
  }
}
