import srcBarRepositories from "../repositories/SrcBarRepositories.js";

export async function getSrcNames(req, res) {
  try {
    const { src } = req.query;
    const srcNames = await srcBarRepositories.getUserNames(src);
    res.status(200).send(srcNames.rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
