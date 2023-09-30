const express = require('express');
const router = express.Router();
const Todo = require('../../models/todo');

const { exportTodosToExcel , addedTodo} = require('./index.controller');


router.post('/addtodo',addedTodo);

// Export todos data to an Excel file
router.get('/export', exportTodosToExcel);

router.get('/', async (req, res) => {
  console.log("todo get enter...");
  const todos = await Todo.findAll();
  res.render('todoIndex', {
    pageTitle: 'Admin Dashboard',
    todos: todos
  });
});

router.post('/update-status', async (req, res) => {
  let { todoId, status } = req.body;
  console.log("todo update status enter...");
  const todo = await Todo.findByPk(todoId);

  if (todo) {
    const currentStatus = parseInt(todo.status);
    status = parseInt(status);
    if (status === currentStatus) {
      console.log("Current status and incoming status are the same");
      return res.redirect('/auth/home');
    } else if (status === 1 && (currentStatus === 0 || currentStatus === 3)) {
      console.log("In Progress option selected");
      todo.status = status;
      if (currentStatus === 0) {
        todo.started_at = new Date();
      } else if (currentStatus === 3) {
        const timeDiffOnHolded = new Date() - new Date(todo.lastonholded_at);
        const onHoldedSeconds = Math.floor(timeDiffOnHolded / 1000);
        const onHoldedMinutes = Math.floor(onHoldedSeconds / 60);
        const onHoldedHours = Math.floor(onHoldedMinutes / 60);
        const onHoldedTime = `${onHoldedHours} : ${onHoldedMinutes % 60} : ${onHoldedSeconds % 60}`;
        todo.onholded_time = onHoldedTime;
      }
      todo.lastonholded_at = null;
    } else if (status === 3 && currentStatus === 1) {
      console.log("On Hold option selected");
      todo.status = status;
      const onHoldedCount = todo.onholded_count ? todo.onholded_count + 1 : 1;
      todo.onholded_count = onHoldedCount;
      todo.lastonholded_at = new Date();
    } else if (status === 4 && currentStatus === 1) {
      console.log("Complete option selected");
      todo.status = status;
      todo.completed_at = new Date();
      const timeTakenInMilliseconds = todo.completed_at - todo.started_at - (todo.onholded_time ? parseInt(todo.onholded_time.split(':')[0]) * 3600 * 1000 + parseInt(todo.onholded_time.split(':')[1]) * 60 * 1000 + parseInt(todo.onholded_time.split(':')[2]) * 1000 : 0);
      const seconds = Math.floor(timeTakenInMilliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const timeTaken = `${hours} : ${minutes % 60} : ${seconds % 60} `;
      todo.timetaken = timeTaken;
    } else {
      console.log("Invalid status transition");
      return res.redirect('/auth/home');
    }

    console.log("todo : ",todo)
    await todo.save();
    res.redirect('/auth/home');
  } else {
    console.log("Todo not found");
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
  }
});

module.exports = router;