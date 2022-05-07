const mongoose = require('mongoose');
const { toJSON, findPage } = require('./plugins');
const { Schema } = mongoose;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    desc: String,
  },
  { timestamps: true }
);

roleSchema.plugin(toJSON);
roleSchema.plugin(findPage);

module.exports = mongoose.model('Role', roleSchema);
