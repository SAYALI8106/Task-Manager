import { createTaskValidator } from "../validators/taskValidator";
import { validationResult } from "express-validator";

test("createTaskValidator fails when name missing", async () => {
  const req: any = { body: {} };

  for (const rule of createTaskValidator) {
    await rule.run(req);
  }

  const errors = validationResult(req);
  expect(errors.isEmpty()).toBe(false);
});
