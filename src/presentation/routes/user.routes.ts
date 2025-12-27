import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  CreateUserDtoSchema,
  UpdateUserDtoSchema,
} from "../../application/dto/user.dto";
import type { UserController } from "../controllers/user.controller";

/**
 * ユーザールート
 * Presentation層 - HTTPルーティング
 */
export function createUserRoutes(controller: UserController) {
  const app = new Hono();

  app.get("/", (c) => controller.list(c));
  app.get("/:id", (c) => controller.get(c));
  app.post("/", zValidator("json", CreateUserDtoSchema), (c) =>
    controller.create(c),
  );
  app.put("/:id", zValidator("json", UpdateUserDtoSchema), (c) =>
    controller.update(c),
  );
  app.delete("/:id", (c) => controller.delete(c));

  return app;
}
