const mongoose = require('mongoose');
const { toJSON, findPage } = require('./plugins');
const { Schema } = mongoose;

const skillTestHistorySchema = new Schema(
  {
    correctSentences: {
      type: Number,
      required: true,
    },
    totalSentences: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    test: { type: Schema.Types.ObjectId, ref: 'SkillTest' },
  },
  { timestamps: true }
);

skillTestHistorySchema.plugin(toJSON);
skillTestHistorySchema.plugin(findPage);

module.exports = mongoose.model('SkillTestHistory', skillTestHistorySchema);
