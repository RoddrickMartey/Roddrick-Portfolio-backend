export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((d) => ({
          path: d.path.join("."),
          msg: d.message,
        })),
      });
    }
    req.body = value; // cleaned
    next();
  };
}
