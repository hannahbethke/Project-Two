const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timesheetSchema = new Schema(
{   
    date: Date,
    startTime: String,
    endTime: String,
    location: String, 
    notes: String,
    user: { type: Schema.Types.ObjectId, ref: 'User'}
});

const Timesheet = mongoose.model('Timesheet', timesheetSchema);

module.exports = Timesheet;