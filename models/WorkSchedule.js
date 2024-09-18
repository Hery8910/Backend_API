const mongoose = require('mongoose');

const workScheduleSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  days: [String],  // Working days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  startTime: String, // start (format: "08:00")
  endTime: String,   // end (format: "16:00")
});

module.exports = mongoose.model('WorkSchedule', workScheduleSchema);
