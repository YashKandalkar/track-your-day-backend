import express from "express";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt";

import loginUser from "./controllers/loginUser.js";
import registerUser from "./controllers/registerUser.js";
import createTask from "./controllers/createTask.js";
import getTasks from "./controllers/getTasks.js";
import deleteTasks from "./controllers/deleteTasks.js";
import updateTask from "./controllers/updateTask.js";
import updateMultiple from "./controllers/updateMultiple.js";
import getHistory from "./controllers/getHistory.js";
import markCompleted from "./controllers/markCompleted.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: "https://yashkandalkar.github.io" }));

const db = knex({
  client: "pg",
  connection:
    process.env.DEV !== "true"
      ? process.env.DATABASE_URL + "?ssl=true"
      : {
          host: "127.0.0.1",
          user: "postgres",
          password: "yash",
          database: "track-your-day",
        },
});

const days_in_between = (StartDate, EndDate) => {
  // The number of milliseconds in all UTC days (no DST)
  const oneDay = 1000 * 60 * 60 * 24;

  // A day in UTC always lasts 24 hours (unlike in other time formats)
  const start = Date.UTC(
    EndDate.getFullYear(),
    EndDate.getMonth(),
    EndDate.getDate()
  );
  const end = Date.UTC(
    StartDate.getFullYear(),
    StartDate.getMonth(),
    StartDate.getDate()
  );

  // so it's safe to divide by 24 hours
  return (start - end) / oneDay;
};

const markAbandonedTasks = (data) => {
  let formattedData = [];
  let abandoned = [];
  data.forEach((task) => {
    const createdDate = new Date(task.created);
    if (days_in_between(createdDate, new Date()) == 0) {
      formattedData.push(task);
    } else {
      abandoned.push(task.task_id);
    }
  });
  db("tasks")
    .update({ status: "abandoned" })
    .whereIn("task_id", abandoned)
    .catch(console.log);
  return formattedData;
};

app.get("/", (req, res) => {
  res.send("An alligator approaches!");
});

app.post("/loginUser", (req, res) => loginUser(req, res, db, bcrypt));
app.post("/registerUser", (req, res) => registerUser(req, res, db, bcrypt));
app.post("/createTask", (req, res) => createTask(req, res, db));
app.post("/getTasks", (req, res) =>
  getTasks(req, res, db, markAbandonedTasks)
);
app.post("/getHistory", (req, res) =>
  getHistory(req, res, db, markAbandonedTasks, days_in_between)
);

app.put("/updateTask", (req, res) => updateTask(req, res, db));
app.put("/updateMultiple", (req, res) => updateMultiple(req, res, db));
app.put("/markCompleted", (req, res) => markCompleted(req, res, db));

app.delete("/deleteTasks", (req, res) => deleteTasks(req, res, db));

app.listen(process.env.PORT || 3001, () =>
  console.log("Gator app listening on port 3001!")
);
