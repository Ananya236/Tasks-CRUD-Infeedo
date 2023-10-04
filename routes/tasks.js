import { Router } from 'express';
import { getAllTasks, createTask, updateTask, deleteTask, getTasksMetrics } from '../controllers/tasks.js';

const router = Router();

router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/metrics', getTasksMetrics);

export default router;
