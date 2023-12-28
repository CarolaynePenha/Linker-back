import joi from "joi";

const srcSchema = joi.object({
  src: joi.string().max(30).min(3),
});

export default srcSchema;
