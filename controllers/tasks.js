import Task from "../models/tasks.js";

export async function createTask(req, res) {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Unable to create task" });
  }
}

export async function getAllTasks(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const offset = (page - 1) * pageSize;

    const tasks = await Task.findAll({
      offset,
      limit: pageSize,
      order: [["created_at", "DESC"]],
    });

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Unable to fetch tasks" });
  }
}

export async function updateTask(req, res) {
  try {
    const taskId = req.params.id;
    const [updatedTask] = await Task.update(req.body, {
      where: { id: taskId },
    });

    if (updatedTask === 1) {
      res.json({ message: "Task updated successfully" });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Unable to update task" });
  }
}

export async function deleteTask(req, res) {
  try {
    const taskId = req.params.id;
    const deletedTask = await Task.destroy({
      where: { id: taskId },
    });

    if (deletedTask) {
      res.json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Unable to delete task" });
  }
}

async function timelineTasks(timelineYear) {
  const metrics = await Task.findAll({
    attributes: [
      [
        Task.sequelize.fn(
          "DATE_FORMAT",
          Task.sequelize.col("created_at"),
          "%M %Y"
        ),
        "month",
      ],
      "status",
      [Task.sequelize.fn("COUNT", Task.sequelize.col("status")), "count"],
    ],
    where: Task.sequelize.where(
      Task.sequelize.fn("YEAR", Task.sequelize.col("created_at")),
      timelineYear
    ),
    group: ["month", "status"],
    order: [[Task.sequelize.col("month"), "ASC"]],
    raw: true,
  });

  const formattedMetrics = {};
  metrics.forEach(
    (metric) =>
      (formattedMetrics[metric.month] = {
        ...(formattedMetrics[metric.month] || {}),
        [metric.status]: metric.count,
      })
  );

  const response = [];
  Object.keys(formattedMetrics).forEach((month) =>
    response.push({
      month,
      metrics: formattedMetrics[month],
    })
  );

  return response;
}

async function statusCount() {
  const metrics = await Task.findAll({
    attributes: ["status", [Task.sequelize.fn("COUNT", "status"), "count"]],
    group: ["status"],
  });

  return metrics;
}

export async function getTasksMetrics(req, res) {
  try {
    const timelineYear = req.query.timelineYear || null;
    const response = timelineYear
      ? await timelineTasks(timelineYear)
      : await statusCount();
    res.json(response);
  } catch (err) {
    console.error("Error fetching task metrics:", err);
    res.status(500).json({ error: "Unable to fetch task metrics" });
  }
}
