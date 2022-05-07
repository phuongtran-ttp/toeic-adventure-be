const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const codeSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['RESET_PASSWORD', 'VERIFY_EMAIL'],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
codeSchema.plugin(toJSON);

/**
 * @typedef Code
 */
const Code = mongoose.model('Code', codeSchema);

module.exports = Code;
