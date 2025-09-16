// server/src/middleware/validate.js
import { z } from 'zod';

export const validate = (schema, where = 'body') => (req, res, next) => {
  const data = req[where]; // req.body | req.query | req.params
  const result = schema.safeParse(data);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }

  // keep parsed values in a safe place
  req.valid ??= {};
  req.valid[where] = result.data;

  next();
};
