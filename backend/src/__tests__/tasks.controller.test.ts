import { mockRequest, mockResponse, mockNext } from "./testUtils";
import * as TaskModel from "../models/taskModel";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  getTaskStats
} from "../controllers/tasksController";

jest.mock("../models/taskModel");

describe("getTasks()", () => {
  it("returns paginated tasks", async () => {
    (TaskModel.getAllTasks as jest.Mock).mockResolvedValue([
      { id: 1, name: "A", done: false, priority: "low" },
      { id: 2, name: "B", done: true, priority: "high" }
    ]);

    const req = mockRequest({ query: {} });
    const res = mockResponse();

    await getTasks(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        total: 2,
        data: expect.any(Array)
      })
    );
  });
});

describe("getTask()", () => {
  it("returns task if found", async () => {
    (TaskModel.getTaskById as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Test",
      done: false
    });

    const req = mockRequest({ params: { id: "1" } });
    const res = mockResponse();

    await getTask(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });

  it("returns 404 if not found", async () => {
    (TaskModel.getTaskById as jest.Mock).mockResolvedValue(null);

    const req = mockRequest({ params: { id: "99" } });
    const res = mockResponse();

    await getTask(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("createTask()", () => {
  it("creates task successfully", async () => {
    const task = { id: 1, name: "New Task", done: false };

    (TaskModel.createTask as jest.Mock).mockResolvedValue(task);

    const req = mockRequest({
      body: { name: "New Task", priority: "low" }
    });

    const res = mockResponse();

    await createTask(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(task);
  });
});

describe("updateTask()", () => {
  it("updates task", async () => {
    (TaskModel.updateTask as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Updated"
    });

    const req = mockRequest({
      params: { id: "1" },
      body: { name: "Updated" }
    });

    const res = mockResponse();

    await updateTask(req, res, mockNext);

    expect(res.json).toHaveBeenCalled();
  });

  it("returns 404 if task missing", async () => {
    (TaskModel.updateTask as jest.Mock).mockResolvedValue(null);

    const req = mockRequest({ params: { id: "1" } });
    const res = mockResponse();

    await updateTask(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("deleteTask()", () => {
  it("deletes task", async () => {
    (TaskModel.deleteTask as jest.Mock).mockResolvedValue(true);

    const req = mockRequest({ params: { id: "1" } });
    const res = mockResponse();

    await deleteTask(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("returns 404 if task not found", async () => {
    (TaskModel.deleteTask as jest.Mock).mockResolvedValue(false);

    const req = mockRequest({ params: { id: "1" } });
    const res = mockResponse();

    await deleteTask(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("toggleTask()", () => {
  it("toggles task done", async () => {
    (TaskModel.toggleTaskDone as jest.Mock).mockResolvedValue({
      id: 1,
      done: true
    });

    const req = mockRequest({ params: { id: "1" } });
    const res = mockResponse();

    await toggleTask(req, res, mockNext);

    expect(res.json).toHaveBeenCalled();
  });
});

describe("getTaskStats()", () => {
  it("returns correct stats", async () => {
    (TaskModel.getAllTasks as jest.Mock).mockResolvedValue([
      { done: true },
      { done: false }
    ]);

    const req = mockRequest();
    const res = mockResponse();

    await getTaskStats(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith({
      total: 2,
      active: 1,
      done: 1
    });
  });
});
