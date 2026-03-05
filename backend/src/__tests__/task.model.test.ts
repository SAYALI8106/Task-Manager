jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}));

import { getTaskById } from "../models/taskModel";
import { promises as fs } from "fs";

test("getTaskById returns null if missing", async () => {
  (fs.readFile as jest.Mock).mockResolvedValue("[]");

  const task = await getTaskById(1);
  expect(task).toBeNull();
});
