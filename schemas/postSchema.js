import joi from "joi";

const postSchema = joi.object({
  description: joi.string().max(1000),
  url: joi.string().uri().required(),
});

export default postSchema;
