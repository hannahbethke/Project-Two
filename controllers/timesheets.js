const express = require('express');
const mongoose = require('mongoose');
const timesheetsRouter = express.Router();

const Timesheet = require('../models/timesheet')
// const User = require('../models/user');


// Add middleware to check if user is logged in

// ROUTES

// Index
timesheetsRouter.get('/', (req, res) => {
    Timesheet.find({}, (err, allTimesheets) => {
            res.render('./timesheets/ts-index.ejs', { allTimesheets });
    });
});

// filtered index route - list all logs by user

// New
timesheetsRouter.get('/new', (req, res) => {
    res.render('./timesheets/ts-new.ejs');
});

// Delete
timesheetsRouter.delete('/:id', (req, res) => {
    Timesheet.findByIdAndDelete(req.params.id, (err, deletedTimesheet) => {
        res.redirect('/timesheets');
    });

})

// Update
timesheetsRouter.put('/:id', (req, res) => {
    Timesheet.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedTimesheet) => {
        res.redirect(`/timesheets/${req.params.id}`);
    })
})

// Create
timesheetsRouter.post('/', (req, res) => {
    Timesheet.create(req.body, (err, newTimesheet) => {
        res.redirect('/timesheets');
    });
});

// Edit
timesheetsRouter.get('/:id/edit', (req, res) => {
    Timesheet.findById(req.params.id, (err, editTimesheet) => {
        res.render('./timesheets/ts-edit.ejs', { editTimesheet });
    });
});

// Show
timesheetsRouter.get('/:id', (req, res) => {
    Timesheet.findById(req.params.id, (err, foundTimesheet) => {
        res.render('./timesheets/ts-show.ejs', { foundTimesheet });
    });
});

module.exports = timesheetsRouter;