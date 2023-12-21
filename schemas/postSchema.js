import joi from "joi";

const postSchema = joi.object({
  description: joi.string().max(1000).min(0),
  url: joi.string().uri().required(),
});

const descriptionSchema = joi.object({
  description: joi.string().max(1000).min(0).required(),
});

const postsShemas = {
  postSchema,
  descriptionSchema,
};

export default postsShemas;
