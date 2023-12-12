import joi from "joi";

const signUpSchema = joi.object({
  name: joi.string().min(5).max(40).required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: joi
    .string()
    .pattern(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}/
    )
    .required(),
  repeatPassword: joi.string().required().valid(joi.ref("password")),
});

export default signUpSchema;
