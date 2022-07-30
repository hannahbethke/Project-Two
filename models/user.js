const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    phone: String,
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 8 }
}, { timestamps: true }); 

module.exports = mongoose.model('User', userSchema);