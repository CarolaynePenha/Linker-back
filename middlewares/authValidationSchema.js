export function validateSchema(schema) {
  return (req, res, next) => {
    const validation = schema.validate(req.body, { abortEarly: false });
    console.log("req.body: ", req.body);
    if (validation.error) {
      return res
        .status(422)
        .send(validation.error.details.map((detail) => detail.message));
    }

    next();
  };
}
