const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: String,
  path: String,
  isDirectory: Boolean,
});

const repositorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folderName: { type: String, required: true },
  files: [fileSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Repository', repositorySchema);
