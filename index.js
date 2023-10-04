import express, {json} from "express";
import sequelize from "./config/mysqldb.js";
import Task from "./routes/tasks.js";

const app = express();
app.use(json());

app.use("/tasks", Task);

const PORT = process.env.PORT || 3000;

sequelize
  .sync() // Sync the database with the models
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database synchronization error:", err);
  });
