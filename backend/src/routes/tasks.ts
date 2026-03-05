import { validateRequest } from "../middlewares/validateRequest";
import {
  createTaskValidator,
  taskIdValidator,
  updateTaskValidator
} from "../validators/taskValidator";
import express from "express";
import * as TasksController from "../controllers/tasksController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.use(authenticate);
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search by task name
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: done
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/", TasksController.getTasks);

/**
 * @swagger
 * /api/tasks/stats:
 *   get:
 *     summary: Get task statistics
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Task statistics
 */
router.get("/stats", TasksController.getTaskStats);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Task found
 *       404:
 *         description: Task not found
 */
router.get("/:id", taskIdValidator, validateRequest, TasksController.getTask);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post(
  "/",
  createTaskValidator,
  validateRequest,
  TasksController.createTask
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               priority:
 *                 type: string
 *               done:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 */
router.put(
  "/:id",
  updateTaskValidator,
  validateRequest,
  TasksController.updateTask
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     responses:
 *       204:
 *         description: Task deleted
 */
router.delete(
  "/:id",
  taskIdValidator,
  validateRequest,
  TasksController.deleteTask
);

/**
 * @swagger
 * /api/tasks/{id}/toggle:
 *   patch:
 *     summary: Toggle task completion
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Task toggled
 */
router.patch(
  "/:id/toggle",
  taskIdValidator,
  validateRequest,
  TasksController.toggleTask
);

export default router;
