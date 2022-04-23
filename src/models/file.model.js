const mongoose = require('mongoose');
const { toJSON, findPage } = require('./plugins');

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    url: {
      type: String,
      require: true,
    },
    mime: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

fileSchema.plugin(toJSON);
fileSchema.plugin(findPage);

module.exports = mongoose.model('File', fileSchema);
