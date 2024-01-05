import joi from "joi";

const commentSchema = joi.object({
  commentText: joi.string().max(1000).min(1).required(),
});

export default commentSchema;
