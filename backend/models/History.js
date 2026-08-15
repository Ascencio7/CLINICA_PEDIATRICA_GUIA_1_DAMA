const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  date: { type: Date, default: Date.now },
  note: { type: String },
});

module.exports = mongoose.model('History', HistorySchema);
