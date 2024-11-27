const Ajv = require("ajv");

const ajv = new Ajv({ allErrors: true, useDefaults: true });

const signupSchema = {
  type: "object",
  properties: {
    userName: { type: "string", minLength: 3 },
    email: { type: "string" }, // Format removed, will handle manually
    password: { type: "string", minLength: 6 },
    role: { type: "string", enum: ["admin", "manager", "user"] },
    managerId: { type: ["string", "null"] },
  },
  required: ["userName", "email", "password", "role"],
  additionalProperties: false,
};

const loginSchema = {
  type: "object",
  properties: {
    userName: { type: "string", minLength: 3 },
    password: { type: "string", minLength: 6 },
  },
  required: ["userName", "password"],
  additionalProperties: false,
};

const validateSignup = (data) => {
  const validate = ajv.compile(signupSchema);
  const isValid = validate(data);

  if (!isValid) {
    const errors = validate.errors.map((err) => {
      switch (err.keyword) {
        case "required":
          return `${err.params.missingProperty}: cannot be empty`;
        case "minLength":
          return `${err.instancePath.slice(1)}: must be at least ${err.params.limit} characters long`;
        case "enum":
          return `${err.instancePath.slice(1)}: must be one of ${err.params.allowedValues.join(", ")}`;
        default:
          return `${err.instancePath.slice(1)}: ${err.message}`;
      }
    });
    return errors;
  }

  // Manual Email Format Check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return ["email: Invalid email format"];
  }

  return null;
};

const validateLogin = (data) => {
  const validate = ajv.compile(loginSchema);
  const isValid = validate(data);

  if (!isValid) {
    const errors = validate.errors.map((err) => {
      switch (err.keyword) {
        case "required":
          return `${err.params.missingProperty}: cannot be empty`;
        case "minLength":
          return `${err.instancePath.slice(1)}: must be at least ${err.params.limit} characters long`;
        default:
          return `${err.instancePath.slice(1)}: ${err.message}`;
      }
    });
    return errors;
  }

  return null;
};

module.exports = {
  validateSignup,
  validateLogin,
};
