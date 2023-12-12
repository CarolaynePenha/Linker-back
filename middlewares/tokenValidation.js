import sessionRepository from "../repositories/sessionRepositories.js";

export default async function tokenValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "").trim();

  if (!token) return res.sendStatus(401);
  try {
    const queryToken = await sessionRepository.getToken(token);
    if (queryToken.rowCount !== 1) {
      return res.sendStatus(401);
    }
    res.locals.userId = queryToken.rows[0];
    next();
  } catch (err) {
    return res.sendStatus(500);
  }
}
