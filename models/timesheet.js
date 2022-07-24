const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timesheetSchema = new Schema({

    // user: { type: Schema.Types.ObjectId, ref: 'User'}
});

const Timesheet = mongoose.model('Timesheet', timesheetSchema);

module.exports = Timesheet;