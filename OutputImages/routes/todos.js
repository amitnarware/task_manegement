const express = require('express');
const router = express.Router();
const  Todo  = require('../models/todo');
const { Op } = require('sequelize');

// "http://localhost:3000/api/todos/update-status" in postman GET request


// API endpoint to check and update task status
router.get('/update-status', async (req, res) => {
    console.log("run todos Api file ");
    try {
        console.log("try parts in todos API file");
        // Get all the todos that are not completed and due date has passed
        const todos = await Todo.findAll({
            where: {
                status: {
                    [Op.ne]: 4, // not equal to 4 (complete)
                },
                due_date: {
                    [Op.lt]: new Date() // less than current date
                }
            },
        });

        // Update the task status to pending (status = 2)
        for (let i = 0; i < todos.length; i++) {
            console.log("for loop in todos API file");
            const todo = todos[i];
            todo.status = 2;
            await todo.save();
        }

        res.json({ message: 'Task status updated successfully' });
    } catch (err) {
        console.log("this is error of API file");
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;